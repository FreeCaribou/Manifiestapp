import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LanguageCommunicationService } from './shared/services/communication/language.communication.service';
import { LoaderCommunicationService } from './shared/services/communication/loader.communication.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: 'home', icon: 'home' },
    { title: 'Programme', url: 'programme', icon: 'receipt' },
    { title: 'Favorite', url: 'favorite', icon: 'star' },
    { title: 'Map', url: 'map', icon: 'map' },
    { title: 'About', url: 'about', icon: 'information-circle' },
    { title: 'BuyTicket', url: 'buy-ticket', icon: 'ticket' },
  ];

  subscriptionBackButton: Subscription;
  subscriptionRouter: Subscription;
  showPlaylistButton = true;

  constructor(
    public platform: Platform,
    public languageCommunication: LanguageCommunicationService,
    public loaderCommunication: LoaderCommunicationService,
    public router: Router
  ) {
    this.init();
  }

  init() {
    this.languageCommunication.init();
    console.log('You use the platform: ', this.platform.platforms(), this.languageCommunication.translate.currentLang);

    this.subscriptionBackButton = this.platform.backButton.subscribe(() => {
      const app = 'app';
      navigator[app].exitApp();
    });

    this.subscriptionRouter = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showPlaylistButton = !event.urlAfterRedirects.includes('/manifiesta-playlist');
      }
    })
  }

  languageSegmentChanged(event) {
    this.languageCommunication.changeLanguage(event.detail.value)
  }

  ionViewWillLeave() {
    this.subscriptionBackButton?.unsubscribe();
    this.subscriptionRouter?.unsubscribe();
  }
}
