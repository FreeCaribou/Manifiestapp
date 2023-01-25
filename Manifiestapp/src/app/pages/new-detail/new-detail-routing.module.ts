import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewDetailPage } from './new-detail.page';

const routes: Routes = [
  {
    path: '',
    component: NewDetailPage,
    data: {noBackExit: true}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewDetailPageRoutingModule {}
