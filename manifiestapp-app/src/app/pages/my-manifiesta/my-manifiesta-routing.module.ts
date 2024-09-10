import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyManifiestaPage } from './my-manifiesta.page';

const routes: Routes = [
  {
    path: '',
    component: MyManifiestaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyManifiestaPageRoutingModule {}
