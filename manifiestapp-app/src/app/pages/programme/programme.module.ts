import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgrammePageRoutingModule } from './programme-routing.module';

import { ProgrammePage } from './programme.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgrammePageRoutingModule,
    SharedModule,
  ],
  declarations: [ProgrammePage]
})
export class ProgrammePageModule { }
