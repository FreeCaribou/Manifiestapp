import { Component, OnInit } from '@angular/core';
import { LanguageCommunicationService } from 'src/app/shared/services/communication/language.communication.service';
import { VolunteerShiftService } from 'src/app/shared/services/data/volunteer-shift/volunteer-shift.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
})
export class AboutPage {

  longTextInfos = '';
  urlShuttleInfo = '';

  constructor(
    private volunteerShiftService: VolunteerShiftService,
    private languageService: LanguageCommunicationService,
  ) { }
  
  ionViewDidEnter() {
    this.urlShuttleInfo = `https://manifiesta.be/${this.languageService.selectedLanguage}/news/shuttle-info/`;
    this.volunteerShiftService.getLongtextOveralInfos().subscribe(ni => {
      this.longTextInfos = ni.text;
    });
  }

}
