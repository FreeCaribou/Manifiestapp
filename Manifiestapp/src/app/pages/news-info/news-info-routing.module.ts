import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsInfoPage } from './news-info.page';

const routes: Routes = [
  {
    path: '',
    component: NewsInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsInfoPageRoutingModule {}
