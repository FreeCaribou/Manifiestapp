import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyTicketPageRoutingModule } from './buy-ticket-routing.module';

import { BuyTicketPage } from './buy-ticket.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyTicketPageRoutingModule,
    SharedModule,
  ],
  declarations: [BuyTicketPage]
})
export class BuyTicketPageModule { }
