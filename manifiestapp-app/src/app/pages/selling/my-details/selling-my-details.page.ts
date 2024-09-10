import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { LocalStorageEnum } from 'src/app/shared/models/LocalStorage.enum';
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
  bestSellingPostalCode: any[];
  bestSellingAll: any[];
  sellingPostalCodeAccount: number;

  isFromWorkingGroup = localStorage.getItem(LocalStorageEnum.SellerFromWorkGroup);
  myDepartment: string = localStorage.getItem(LocalStorageEnum.SellerDepartment);

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
      this.sellingService.getMyCurrentPostCodeSellingInformation(),
      this.sellingService.getAllSellingInformation(),
    ]).subscribe(data => {
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

      this.bestSellingDepartment = data[1];
      this.bestSellingPostalCode = data[2].bestSelling;
      this.sellingPostalCodeAccount = data[2].totalAmountTicket;
      this.bestSellingAll = data[3];

    }).add(() => {this.loadingCommunication.changeLoaderTo(false)});
  }

}
