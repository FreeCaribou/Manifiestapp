import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubprogrammePageRoutingModule } from './subprogramme-routing.module';

import { SubprogrammePage } from './subprogramme.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubprogrammePageRoutingModule,
    SharedModule,
  ],
  declarations: [SubprogrammePage]
})
export class SubprogrammePageModule { }
