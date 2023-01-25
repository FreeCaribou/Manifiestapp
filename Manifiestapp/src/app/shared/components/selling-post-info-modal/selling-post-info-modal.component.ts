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

  constructor(
    public modalController: ModalController,
    private router: Router
  ) {
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
