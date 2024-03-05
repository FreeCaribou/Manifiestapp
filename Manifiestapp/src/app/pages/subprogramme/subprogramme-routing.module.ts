import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubprogrammePage } from './subprogramme.page';
import { SubprogrammeDatePage } from './subprogramme-date/subprogramme-date.page';
import { SubprogrammeDateTabPage } from './subprogramme-date/subprogramme-date-tab.page';
import { SubprogrammeLocalisationTabPage } from './subprogramme-localisation/subprogramme-localisation-tab.page';
import { SubprogrammeLocalisationPage } from './subprogramme-localisation/subprogramme-localisation.page';
import { SubprogrammeTypeTabPage } from './subprogramme-type/subprogramme-type-tab.page';
import { SubprogrammeTypePage } from './subprogramme-type/subprogramme-type.page';

const routes: Routes = [
  {
    path: 'date',
    component: SubprogrammeDateTabPage,
    children: [
      {
        path: ':dayId',
        component: SubprogrammeDatePage,
      },
    ]
  },
  {
    path: 'localisation',
    component: SubprogrammeLocalisationTabPage,
  },
  {
    path: 'type',
    component: SubprogrammeTypeTabPage,
    children: [
      {
        path: ':type',
        component: SubprogrammeTypePage,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubprogrammePageRoutingModule { }
