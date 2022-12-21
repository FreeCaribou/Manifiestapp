import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SellingPageRoutingModule } from './selling-routing.module';

import { SellingPage } from './selling.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SellingPageRoutingModule,
    SharedModule,
    FormsModule, ReactiveFormsModule,
  ],
  declarations: [SellingPage]
})
export class SellingPageModule {}
