import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubprogrammePageRoutingModule } from './subprogramme-routing.module';

import { SubprogrammePage } from './subprogramme.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { SubprogrammeDatePage } from './subprogramme-date/subprogramme-date.page';
import { SubprogrammeDateTabPage } from './subprogramme-date/subprogramme-date-tab.page';
import { SubprogrammeLocalisationTabPage } from './subprogramme-localisation/subprogramme-localisation-tab.page';
import { SubprogrammeLocalisationPage } from './subprogramme-localisation/subprogramme-localisation.page';
import { SubprogrammeTypeTabPage } from './subprogramme-type/subprogramme-type-tab.page';
import { SubprogrammeTypePage } from './subprogramme-type/subprogramme-type.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubprogrammePageRoutingModule,
    SharedModule,
  ],
  declarations: [
    SubprogrammePage,
    SubprogrammeDatePage,
    SubprogrammeDateTabPage,
    SubprogrammeLocalisationTabPage,
    SubprogrammeLocalisationPage,
    SubprogrammeTypeTabPage,
    SubprogrammeTypePage,
  ]
})
export class SubprogrammePageModule { }
