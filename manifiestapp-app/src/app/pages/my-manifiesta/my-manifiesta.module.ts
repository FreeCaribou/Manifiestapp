import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MyManifiestaPageRoutingModule } from './my-manifiesta-routing.module';

import { MyManifiestaPage } from './my-manifiesta.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MyManifiestaPageRoutingModule,
    SharedModule
  ],
  declarations: [MyManifiestaPage]
})
export class MyManifiestaPageModule { }
