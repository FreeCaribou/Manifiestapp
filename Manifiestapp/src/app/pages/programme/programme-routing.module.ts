import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgrammePage } from './programme.page';

const routes: Routes = [
  {
    path: '',
    component: ProgrammePage,
    children: [
      {
        path: 'subprogramme/:dayId',
        loadChildren: () => import('../subprogramme/subprogramme.module').then(m => m.SubprogrammePageModule)
      },
    ]
  },
  {
    path: 'event-detail/:id',
    loadChildren: () => import('../event-detail/event-detail.module').then(m => m.EventDetailPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgrammePageRoutingModule { }
