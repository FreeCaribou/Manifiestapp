import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {
  HttpClient, HttpClientModule, HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpErrorInterceptor } from './shared/services/data/http-error.interceptor';
import { SharedModule } from './shared/shared.module';
import { SellingPageModule } from './pages/selling/selling.module';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';

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
    SharedModule,
    SellingPageModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AppAvailability,
    Diagnostic,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
