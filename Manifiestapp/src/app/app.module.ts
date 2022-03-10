import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import {
  HttpClient, HttpClientModule,
} from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { ProgrammeDataService } from './shared/services/data/programme/programme.data.service';
import { ProgrammeMockService } from './shared/services/data/programme/programme.mock.service';
import { InfoListDataService } from './shared/services/data/info-list/info-list.data.service';
import { InfoListMockService } from './shared/services/data/info-list/info-list.mock.service';
import { VolunteerShiftService } from './shared/services/data/volunteer-shift/volunteer-shift.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    TranslateModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    VolunteerShiftService,
    environment.dataMock ? { provide: ProgrammeDataService, useClass: ProgrammeMockService } : ProgrammeDataService,
    environment.dataMock ? { provide: InfoListDataService, useClass: InfoListMockService } : InfoListDataService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
