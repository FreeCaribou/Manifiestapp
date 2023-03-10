import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-selling-post-info-modal',
  templateUrl: './selling-post-info-modal.component.html',
})
export class SellingPostInfoModalComponent implements OnInit {
  @Input()
  totalAmountTicket: number;
  @Input()
  sellerSellingGoal: number
  @Input()
  mySellingInfo;
  @Input()
  sellerSendingDataI18NParam;
  @Input()
  sellerNameI18NParam;
  @Input()
  finishSellingInfo;

  constructor(
    public modalController: ModalController,
    private router: Router
  ) {
  }

  get finishSellingInfoDataI18NParam() {
    let ticketSells = 0;
    try {
      const carts = this.finishSellingInfo.order.cart.items.types;
      carts.forEach(e => { ticketSells += e.quantity });
    } catch (e) {
      
    }
    return {
      numberTicket: ticketSells,
      fullName: `${this.finishSellingInfo?.order?.customer?.firstname} ${this.finishSellingInfo?.order?.customer?.lastname}`,
      email: this.finishSellingInfo?.order?.customer?.email,
      eventSquareRef: this.finishSellingInfo?.order?.reference,
    };
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(r => {
      this.closeShowAfterSellingModal();
    });
  }

  async closeShowAfterSellingModal() {
    const modal = await this.modalController.getTop();
    if (modal) {
      this.modalController?.dismiss();
    }
  }

}
