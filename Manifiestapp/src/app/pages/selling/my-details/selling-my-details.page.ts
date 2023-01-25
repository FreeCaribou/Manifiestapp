import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { SellingService } from 'src/app/shared/services/data/selling/selling.service';
import { VolunteerShiftService } from 'src/app/shared/services/data/volunteer-shift/volunteer-shift.service';

@Component({
  selector: 'app-selling-my-details',
  templateUrl: './selling-my-details.page.html',
})
export class SellingMyDetailsPage {
  mySellingInfo;
  totalAmountTicket;
  sellerSellingGoal;
  bestSellingDepartment: any[];
  sellingDepartmentAccount: number;
  bestSellingNational: any[];
  sellingNationalAccount: number;
  bestSellingPostalCode: any[];
  sellingPostalCodeAccount: number;

  defaultHref = '/selling';

  constructor(
    public loadingCommunication: LoadingCommunicationService,
    private sellingService: SellingService,
    public volunteerShiftService: VolunteerShiftService,
  ) {
  }

  get sellerSendingDataI18NParam() {
    return {
      totalSelling: this.mySellingInfo?.data?.length,
      totalTickets: this.mySellingInfo?.totalAmountTicket
    };
  }

  ionViewDidEnter() {
    this.loadingCommunication.changeLoaderTo(true);
    forkJoin([
      this.sellingService.getMySellingInformation(),
      this.sellingService.getMyCurrentDepartmentSellingInformation(),
      this.sellingService.getAllSellingInformation(),
      this.sellingService.getMyCurrentPostCodeSellingInformation(),
    ]).subscribe(data => {
      console.log('data', data[0], data[1], data[2], data[3])
      // TODO
      // 'Translate' the department id - label
      // Show detail of ticket
      this.mySellingInfo = data[0];
      this.totalAmountTicket = this.mySellingInfo.totalAmountTicket;
      this.sellerSellingGoal = this.volunteerShiftService.getSellerSellingGoal();

      this.mySellingInfo.data = this.mySellingInfo.data.map(d => {
        let ticketInfoPrice = 0;
        d.ticketInfo?.forEach(d => {
          ticketInfoPrice += d.ticketPrice * d.ticketAmount;
        });
        if (isNaN(ticketInfoPrice)) {
          ticketInfoPrice = null;
        }
        return {...d, ticketInfoPrice};
      });

      this.bestSellingDepartment = data[1].bestSelling;
      this.sellingDepartmentAccount = data[1].totalAmountTicket;
      this.bestSellingNational = data[2].data;
      this.sellingNationalAccount = data[2].totalAmountTicket;
      this.bestSellingPostalCode = data[3].bestSelling;
      this.sellingPostalCodeAccount = data[3].totalAmountTicket;

    }).add(() => {this.loadingCommunication.changeLoaderTo(false)});
  }

}
