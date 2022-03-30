import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewDetailPageRoutingModule } from './new-detail-routing.module';

import { NewDetailPage } from './new-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewDetailPageRoutingModule,
    SharedModule,
  ],
  declarations: [NewDetailPage]
})
export class NewDetailPageModule {}
