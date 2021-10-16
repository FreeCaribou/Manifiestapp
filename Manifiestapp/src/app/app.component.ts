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
    { title: 'About', url: 'about', icon: 'information-circle' },
  ];

  constructor(private languageCommunication: LanguageCommunicationService,) {
    this.init();
  }

  init() {
    this.languageCommunication.init();

    console.log(this.languageCommunication.selectedLanguage)
  }

  languageSegmentChanged(event) {
    console.log(event);
    this.languageCommunication.changeLanguage(event.detail.value)
  }
}
