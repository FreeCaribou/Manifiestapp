import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SellersService } from 'src/app/shared/services/api/sellers.service';
import { ExcelService } from 'src/app/shared/services/communication/excel.service';
import { LoaderService } from 'src/app/shared/services/communication/loader.service';
import { LoginService } from 'src/app/shared/services/communication/login.service';

@Component({
  selector: 'app-page-sellings-tickets',
  templateUrl: './page-sellings-tickets.component.html',
  styleUrls: ['./page-sellings-tickets.component.scss']
})
export class PageSellingsTicketsComponent implements OnInit {

  displayedDepartmentColumns: string[] = ['action', 'type', 'clientName', 'channel', 'zip', 'date', 'price', 'sellerName', 'workGroup', 'merchRef'];
  sellingInformationsAllBase: any[] = [];
  sellingInformationsAmountTickets!: number;

  // Filter
  table: any[] = [];
  isWorkingGroup = false;
  zipList: string[] = [];
  zipSelected = new FormControl([]);
  zipAsked = '';
  channelList: string[] = [];
  channelSelected = new FormControl([]);
  sellerNameList: string[] = [];
  sellerNameSelected = new FormControl([]);
  sellerNameAsked = '';

  // Chart
  chartOptions = {};
  chart2Options = {};
  iLikeChart = false;
  dateTable: { date: string, amount: number, amountSince?: number }[] = [];

  canEdit = false;

  constructor(
    private sellersService: SellersService,
    public dialog: MatDialog,
    private excelService: ExcelService,
    private loaderService: LoaderService,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.initTable();
  }

  initTable() {
    this.loaderService.startLoading(PageSellingsTicketsComponent.name);
    this.sellersService.getAllFinishSellingsInformationTickets().subscribe(data => {
      this.canEdit = this.loginService.getRoles().includes('ADMIN');
      if (!this.canEdit) {
        // We remove the action column if we can edit
        this.displayedDepartmentColumns.shift();
      }
      this.sellingInformationsAllBase = data;
      this.sellingInformationsAmountTickets = this.sellingInformationsAllBase.length;
      this.table = this.sellingInformationsAllBase;

      this.zipList = [...new Set(this.sellingInformationsAllBase.map(s => s.zip))].sort();
      this.channelList = [...new Set(this.sellingInformationsAllBase.map(s => s.channel))].sort();
      this.sellerNameList = [...new Set(this.sellingInformationsAllBase.map(s => s.sellerName))].sort();

      this.table.forEach(t => {
        const date = `${new Date(t.date).getFullYear()}-${new Date(t.date).getUTCMonth() + 1}-${new Date(t.date).getDate()}`;
        const index = this.dateTable.findIndex(dt => dt.date === date);
        if (index > -1) {
          this.dateTable[index].amount++;
        } else {
          this.dateTable.push({ date: date, amount: 1 });
        }
      })

      this.dateTable = this.dateTable.sort((a, b) => {
        return a > b ? 1 : -1;
      });

      this.dateTable.forEach((dt, index) => {
        if (index === 0) {
          this.dateTable[0].amountSince = this.dateTable[0].amount;
        } else {
          this.dateTable[index].amountSince = this.dateTable[index].amount + (this.dateTable[index - 1]?.amountSince as number);
        }
      });

      // TODO find a balance how to show the date
      // Each date is useless, to much x
      // Each date with a selling can be no representatif (if we have 5 days without selling for e.g.)
      // Need to try each week maybe

      this.chartOptions = {
        title: { text: 'Sales through time' },
        axisY: { title: 'Total selling' },
        data: [{
          type: 'stepLine',
          dataPoints: this.dateTable.map((dt, key) => { return { x: new Date(dt.date), y: dt.amountSince } })
        }]
      };


      // One day transform that to bart with multi level, week by week
      // https://canvasjs.com/angular-charts/stacked-column-chart/
      this.chart2Options = {
        title: {
          text: "Sales each days"
        },
        animationEnabled: true,
        data: [{
          type: "column",
          dataPoints: this.dateTable.map(dt => { return { x: new Date(dt.date), y: dt.amount } })
        }]
      }

      // usefull to get all email adress
      // const listOfMail: any[] = [...new Set(data.map((d: any) => d.sellerId.toLowerCase()))];
      // console.log(
      //   'list of mail', data,
      //   listOfMail,
      //   listOfMail.slice(0, 99).join(','),
      //   listOfMail.slice(99, 199).join(','),
      //   listOfMail.slice(199, 299).join(','),
      //   listOfMail.slice(299, 399).join(','),
      //   listOfMail.slice(399, 499).join(','),
      //   listOfMail.slice(499, 599).join(','),
      //   listOfMail.slice(599, 699).join(','),
      //   listOfMail.slice(699, 799).join(','),
      //   listOfMail.slice(799, 899).join(','),
      //   listOfMail.slice(899, 999).join(','),
      //   listOfMail.slice(999, 1099).join(','),
      //   listOfMail.slice(1099, 1199).join(','),
      // )
    }).add(() => {
      this.loaderService.stopLoading(PageSellingsTicketsComponent.name);
      this.filtering();
    });
  }

  export() {
    this.excelService.exportAsExcelFile(this.sellingInformationsAllBase, 'all-tickets-sellings-snapshot');
  }

  filtering() {
    this.table = this.sellingInformationsAllBase;

    if (this.isWorkingGroup) {
      this.table = this.sellingInformationsAllBase.filter(x => { return x.workGroup });
    }

    if (this.zipSelected?.value && this.zipSelected?.value?.length > 0) {
      this.table = this.table.filter(x => { return this.zipSelected.value?.includes(x.zip as never) });
    }

    if (this.channelSelected?.value && this.channelSelected?.value?.length > 0) {
      this.table = this.table.filter(x => { return this.channelSelected.value?.includes(x.channel as never) });
    }

    if (this.sellerNameSelected?.value && this.sellerNameSelected?.value?.length > 0) {
      this.table = this.table.filter(x => { return this.sellerNameSelected.value?.includes(x.sellerName as never) });
    }

    if (this.zipAsked && this.zipAsked !== '') {
      this.table = this.table.filter(x => { return x.zip?.toLowerCase().includes(this.zipAsked.toLowerCase()) });
    }

    if (this.sellerNameAsked && this.sellerNameAsked !== '') {
      this.table = this.table.filter(x => { return x?.sellerName?.toLowerCase().includes(this.sellerNameAsked.toLowerCase()) });
    }
  }

  changeWorkingGroup() {
    this.isWorkingGroup = !this.isWorkingGroup;
    this.filtering();
  }

  iLikeChartChange() {
    this.iLikeChart = !this.iLikeChart;
  }

  edit(element: any) {
    const dialogRef = this.dialog.open(EditSellingInfoModal, {
      data: { ...element },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'edit') {
        this.initTable();
      }
    });
  }

}

@Component({
  selector: 'app-edit-selling-info-modal',
  templateUrl: 'edit-selling-info-modal.html',
})
export class EditSellingInfoModal implements OnInit {
  departments = [];

  constructor(
    public dialogRef: MatDialogRef<EditSellingInfoModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sellersService: SellersService,
  ) { }

  ngOnInit(): void {
    this.sellersService.getAllPossibleDepartments().subscribe(departments => {
      this.departments = departments;
    })
  }

  save() {
    this.sellersService.editSellingInformation(this.data.id, {
      sellerPostalCode: this.data.zip, fromWorkGroup: this.data.workGroup, sellerDepartmentId: this.data.department
    }).subscribe(data => {
      this.dialogRef.close('edit');
    });
  }

}
