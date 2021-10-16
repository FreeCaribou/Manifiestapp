import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { ProgrammeDataService } from './shared/services/data/programme/programme.data.service';
import { ProgrammeMockService } from './shared/services/data/programme/programme.mock.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    environment.dataMock ? { provide: ProgrammeDataService, useClass: ProgrammeMockService } : ProgrammeDataService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
