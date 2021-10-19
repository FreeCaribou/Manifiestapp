import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgrammePage } from './programme.page';

const routes: Routes = [
  {
    path: '',
    component: ProgrammePage,
    children: [
      {
        path: 'subprogramme-saturday',
        data: {
          day: 'saturday'
        },
        loadChildren: () => import('../subprogramme/subprogramme.module').then(m => m.SubprogrammePageModule)
      },
      {
        path: 'subprogramme-sunday',
        data: {
          day: 'sunday'
        },
        loadChildren: () => import('../subprogramme/subprogramme.module').then(m => m.SubprogrammePageModule)
      },
      {
        path: '',
        redirectTo: 'subprogramme-saturday',
      },
    ]
  },
  {
    path: 'event/:id',
    loadChildren: () => import('../event-detail/event-detail.module').then(m => m.EventDetailPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgrammePageRoutingModule { }
