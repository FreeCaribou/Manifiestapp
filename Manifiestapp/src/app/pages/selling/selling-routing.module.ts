import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellingPage } from './selling.page';

const routes: Routes = [
  {
    path: '',
    component: SellingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellingPageRoutingModule {}
