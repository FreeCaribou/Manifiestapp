import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { tap } from 'rxjs';
import { SellersService } from 'src/app/shared/services/api/sellers.service';
import { LoaderService } from 'src/app/shared/services/communication/loader.service';
import { sortData } from 'src/app/shared/utils/sort-data.utils';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss']
})
export class PageHomeComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedSellersColumns: string[] = ['name', 'sellerId', 'details', 'quantity'];
  sellerSellingInformationsAll: any[] = [];
  sellingInformationsAmountTickets!: number;
  // sortedData: any[] = [];
  sortedData = new MatTableDataSource<any>([]);
  ticketsType: { id: string; label: string; amount: number }[] = [];
  chartOptions = {};
  iLikeChart = false;

  constructor(
    private sellersService: SellersService, 
    public dialog: MatDialog,
    private loaderService: LoaderService,
  ) { }

  ngAfterViewInit() {
    this.sortedData.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loaderService.startLoading(PageHomeComponent.name);
    this.sellersService.getAllSellerSellingInformation().pipe(
      tap(data => {
        this.sellerSellingInformationsAll = data.data;
        this.sellingInformationsAmountTickets = data.totalAmountTicket;
        this.sortedData.data = this.sellerSellingInformationsAll.slice();
        this.sortedData.data.forEach(sd => {
          sd.details.forEach((d: any) => {
            d?.ticketInfo?.forEach((ti: any) => {
              const index = this.ticketsType.findIndex(tt => tt.id === ti.ticketId);
              if (index > -1) {
                this.ticketsType[index].amount += ti.ticketAmount;
              } else {
                this.ticketsType.push({ id: ti.ticketId, label: ti.ticketLabel, amount: ti.ticketAmount });
              }
            });
          });
        });
  
        this.chartOptions = {
          title: {
            text: "Sales by ticket types"
          },
          data: [{
            type: "pie",
            startAngle: -90,
            indexLabel: "{name}: {y} - {q} sellings",
            yValueFormatString: "#,###.##'%'",
            dataPoints: this.ticketsType.map(tt => {
              return {
                y: tt.amount / this.sellingInformationsAmountTickets * 100,
                name: tt.label,
                q: tt.amount
              }
            })
          }]
        }
      })
    ).subscribe().add(() => this.loaderService.stopLoading(PageHomeComponent.name));
  }

  sortingData(sort: Sort) {
    this.sortedData.data = sortData(sort, this.sellerSellingInformationsAll);
  }

  details(element: any) {
    const dialogRef = this.dialog.open(SellerSellingModal, {
      data: element,
    });
  }

  iLikeChartChange() {
    this.iLikeChart = !this.iLikeChart;
  }

}

@Component({
  selector: 'app-seller-selling-modal',
  templateUrl: 'seller-selling-modal.html',
})
export class SellerSellingModal {
  constructor(
    public dialogRef: MatDialogRef<SellerSellingModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
}
