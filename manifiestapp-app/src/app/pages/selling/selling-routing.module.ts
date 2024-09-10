import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SellingMyDetailsPage } from './my-details/selling-my-details.page';

import { SellingPage } from './selling.page';

const routes: Routes = [
  {
    path: '',
    component: SellingPage,
    data: { noBackExit: false },
    
  },
  {
    path: 'my-details',
    component: SellingMyDetailsPage,
    data: {noBackExit: true}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellingPageRoutingModule {}
