import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyTicketPage } from './buy-ticket.page';

const routes: Routes = [
  {
    path: '',
    component: BuyTicketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyTicketPageRoutingModule {}
