import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-my-selling-little-recap',
  templateUrl: './my-selling-little-recap.component.html',
})
export class MySellingLittleRecapComponent {
  @Input()
  mySellingInfo;

  @Input()
  sellerSellingGoal;

  @Input()
  postSelling = false;

  constructor() {
  }

  get sellerSendingDataI18NParam() {
    return {
      totalSelling: this.mySellingInfo?.data?.length,
      totalTickets: this.mySellingInfo?.totalAmountTicket
    };
  }

  get restingTicketI18NParam() {
    return {
      restingTicket: this.sellerSellingGoal - this.mySellingInfo?.totalAmountTicket,
      goal: this.sellerSellingGoal
    }
  }

  openMyInfo() {
    
  }

}
