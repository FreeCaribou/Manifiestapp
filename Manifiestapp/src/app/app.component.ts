import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LanguageCommunicationService } from './shared/services/communication/language.communication.service';

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

  subBackButton: Subscription;
  subRouter: Subscription;
  showPlaylistButton = true;

  constructor(
    public platform: Platform,
    public languageCommunication: LanguageCommunicationService,
    public router: Router
  ) {
    this.init();
  }

  init() {
    this.languageCommunication.init();
    console.log('You use the platform: ', this.platform.platforms(), this.languageCommunication.translate.currentLang);

    this.subBackButton = this.platform.backButton.subscribe(() => {
      const app = 'app';
      navigator[app].exitApp();
    });


    // when the user tap on the physical back button of the device, we want to close the app
    // but not for all page !
    const pageWithoutBackButton = [
      '/programme/event-detail'
    ];
    this.subRouter = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('change page', event)
        this.showPlaylistButton = !event.urlAfterRedirects.includes('/manifiesta-playlist');

        this.subBackButton?.unsubscribe();
        if (!pageWithoutBackButton.find(x => event.urlAfterRedirects.includes(x))) {
          console.log('back button please')
          this.subBackButton = this.platform.backButton.subscribe(() => {
            const app = 'app';
            navigator[app].exitApp();
          });
        }

      }
    })
  }

  languageSegmentChanged(event) {
    this.languageCommunication.changeLanguage(event.detail.value)
  }

  ionViewWillLeave() {
    this.subRouter?.unsubscribe();
    this.subBackButton?.unsubscribe();
  }
}
