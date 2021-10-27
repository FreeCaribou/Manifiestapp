import { Component } from '@angular/core';
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

  constructor(private languageCommunication: LanguageCommunicationService,) {
    this.init();
  }

  init() {
    this.languageCommunication.init();
  }

  languageSegmentChanged(event) {
    this.languageCommunication.changeLanguage(event.detail.value)
  }
}
