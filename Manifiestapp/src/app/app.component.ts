import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
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

  constructor(
    public platform: Platform,
    private languageCommunication: LanguageCommunicationService,
    public loaderCommunication: LoaderCommunicationService
  ) {
    this.init();
  }

  init() {
    console.log('You use the platform: ', this.platform.platforms());
    this.languageCommunication.init();
  }

  languageSegmentChanged(event) {
    this.languageCommunication.changeLanguage(event.detail.value)
  }
}
