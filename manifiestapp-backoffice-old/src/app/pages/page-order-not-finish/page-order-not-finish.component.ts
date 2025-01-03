import { Component, Inject, OnInit } from '@angular/core';
import { SellersService } from 'src/app/shared/services/api/sellers.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/shared/services/communication/excel.service';

@Component({
  selector: 'app-page-order-not-finish',
  templateUrl: './page-order-not-finish.component.html',
  styleUrls: ['./page-order-not-finish.component.scss']
})
export class PageOrderNotFinishComponent implements OnInit {

  displayedSellersColumns: string[] = ['merchantReference', 'date', 'name', 'email', 'details', 'actions'];
  data: any[] = [];
  sellingInformationsAmountTickets!: number;

  verificationOccur = false;

  constructor(
    private sellersService: SellersService,
    public dialog: MatDialog,
    private excelService: ExcelService,
  ) { }

  ngOnInit(): void {
    this.initTable();
  }

  initTable(): void {
    this.sellersService.getOrderNotFinish().subscribe(data => {
      this.data = data;
    });
  }

  finishProcessModal(element: any) {
    const dialogRef = this.dialog.open(FinishOrderModal, {
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.initTable();
    });
  }

  receiveExcelFile(event: any) {
    this.verificationOccur = true;
    try {
      console.log('Begin of take the data from the excel')
      let reader = new FileReader();
      reader.readAsArrayBuffer(event.target.files[0]);
      reader.onload = () => {
        let data = new Uint8Array(reader.result as ArrayBuffer);
        let workbook = XLSX.read(data, { type: 'array' });
        XLSX.utils.sheet_to_json(workbook)
        let jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
        console.log('Data brut', workbook, jsonData)

        jsonData = jsonData.map((jd: any) => {
          let merchantRef = jd['Merchant Reference'].toString();
          return {
            vwTransactionId: jd['Transaction ID'],
            clientTransactionId: merchantRef.replace('="', '').replace('"', ''),
          }
        });

        const preFilter = jsonData.filter((onf: any) => this.data.find((fo: any) => fo.clientTransactionId === onf.clientTransactionId));
        console.log('the final json', jsonData, this.data, preFilter)

        this.sellersService.finishOrders(preFilter).subscribe(dataR => {
          console.log('dataR', dataR)
          this.initTable();

          this.excelService.exportAsExcelFile(dataR, 'order-not-finished');
        }).add(() => { this.verificationOccur = false; })
      }
    } catch (e) {
      console.warn('error for upload file', e)
      this.verificationOccur = false;
    }
  }

}

@Component({
  selector: 'app-finish-order-modal',
  templateUrl: 'finish-order-modal.html',
})
export class FinishOrderModal {
  constructor(
    public dialogRef: MatDialogRef<FinishOrderModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sellersService: SellersService,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  finish() {
    this.sellersService.finishOrder(this.data).pipe(
      take(1)
    ).subscribe(() => {
      this.dialogRef.close();
    });
  }
}
