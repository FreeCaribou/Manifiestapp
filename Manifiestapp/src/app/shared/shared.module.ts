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
import { environment } from 'src/environments/environment';
import { InfoListDataService } from './services/data/info-list/info-list.data.service';
import { InfoListMockService } from './services/data/info-list/info-list.mock.service';
import { ProgrammeDataService } from './services/data/programme/programme.data.service';
import { ProgrammeMockService } from './services/data/programme/programme.mock.service';
import { NewsListService } from './services/data/news-list/news-list.service';
import { SellingService } from './services/data/selling/selling.service';
import { ThermometerComponent } from './components/thermometer/thermometer.component';
import { SellingPostInfoModalComponent } from './components/selling-post-info-modal/selling-post-info-modal.component';
import { TopSellerListComponent } from './components/top-seller-list/top-seller-list.component';
import { MySellingLittleRecapComponent } from './components/my-selling-little-recap/my-selling-little-recap.component';
import { SellerDepartmentInfoModalComponent } from './components/seller-department-info-modal/seller-department-info-modal.component';
import { VivaWalletVerificationComponent } from './components/viva-wallet-verification/viva-wallet-verification.component';
import { CategoriesListPipe } from './pipe/categories-list.pipe';
import { LanguagesListPipe } from './pipe/languages-list.pipe';
import { SpeakerListComponent } from './components/speaker-list/speaker-list.component';
import { SpeakerCardComponent } from './components/speaker-card/speaker-card.component';

@NgModule({
  declarations: [
    HeaderComponent,
    EventCardComponent,
    EventListCardComponent,
    EventListComponent,
    SpeakerListComponent,
    SpeakerCardComponent,
    SimpleDatePipe,
    CategoriesListPipe,
    LanguagesListPipe,
    SelectLangComponent,
    ThermometerComponent,
    SellingPostInfoModalComponent,
    SellerDepartmentInfoModalComponent,
    TopSellerListComponent,
    MySellingLittleRecapComponent,
    VivaWalletVerificationComponent,
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
    ThermometerComponent,
    EventCardComponent,
    EventListCardComponent,
    TranslateModule,
    LeafletModule,
    SimpleDatePipe,
    CategoriesListPipe,
    LanguagesListPipe,
    EventListComponent,
    FormsModule,
    ReactiveFormsModule,
    SellingPostInfoModalComponent,
    SellerDepartmentInfoModalComponent,
    TopSellerListComponent,
    MySellingLittleRecapComponent,
    VivaWalletVerificationComponent,
    SpeakerListComponent,
    SpeakerCardComponent,
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
