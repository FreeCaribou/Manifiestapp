import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { EventListCardComponent } from './components/event-list-card/event-list-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapCommunicationService } from './services/communication/map.communication.service';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    HeaderComponent,
    EventCardComponent,
    EventListCardComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    LeafletModule,
    RouterModule
  ],
  exports: [
    IonicModule,
    CommonModule,
    HeaderComponent,
    EventCardComponent,
    EventListCardComponent,
    TranslateModule,
    LeafletModule,
  ],
  providers: [
    MapCommunicationService
  ]
})
export class SharedModule { }
