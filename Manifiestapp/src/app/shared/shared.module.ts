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
import { SimpleDatePipe } from './pipe/simple-date.pipe';
import { SelectLangComponent } from './components/select-lang/select-lang.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VolunteerShiftService } from './services/data/volunteer-shift/volunteer-shift.service';
import { environment } from 'src/environments/environment';
import { InfoListDataService } from './services/data/info-list/info-list.data.service';
import { InfoListMockService } from './services/data/info-list/info-list.mock.service';
import { ProgrammeDataService } from './services/data/programme/programme.data.service';
import { ProgrammeMockService } from './services/data/programme/programme.mock.service';
import { NewsListService } from './services/data/news-list/news-list.service';
import { SellingService } from './services/data/selling/selling.service';

@NgModule({
  declarations: [
    HeaderComponent,
    EventCardComponent,
    EventListCardComponent,
    EventListComponent,
    SimpleDatePipe,
    SelectLangComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    LeafletModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    IonicModule,
    CommonModule,
    HeaderComponent,
    EventCardComponent,
    EventListCardComponent,
    TranslateModule,
    LeafletModule,
    SimpleDatePipe,
    EventListComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    MapCommunicationService,
    // VolunteerShiftService,
    NewsListService,
    SellingService,
    environment.dataMock ? { provide: ProgrammeDataService, useClass: ProgrammeMockService } : ProgrammeDataService,
    environment.dataMock ? { provide: InfoListDataService, useClass: InfoListMockService } : InfoListDataService,
  ]
})
export class SharedModule { }
