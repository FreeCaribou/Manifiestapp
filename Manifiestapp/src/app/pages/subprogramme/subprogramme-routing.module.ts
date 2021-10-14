import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubprogrammePage } from './subprogramme.page';

const routes: Routes = [
  {
    path: '',
    component: SubprogrammePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubprogrammePageRoutingModule {}
