import { Component, OnInit } from '@angular/core';
import { LanguageCommunicationService } from 'src/app/shared/services/communication/language.communication.service';
import { InfoListService } from 'src/app/shared/services/data/info-list/info-list.service';
import { VolunteerShiftService } from 'src/app/shared/services/data/volunteer-shift/volunteer-shift.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
})
export class AboutPage {

  longTextInfos = '';
  urlShuttleInfo = '';
  urlPlanning = '';

  sponsors = [];

  constructor(
    private volunteerShiftService: VolunteerShiftService,
    private languageService: LanguageCommunicationService,
    private infoService: InfoListService,
  ) { }
  
  ionViewDidEnter() {
    this.urlShuttleInfo = `https://manifiesta.be/${this.languageService.selectedLanguage}/news/shuttle-info/`;
    this.urlPlanning = `http://whoissamy.be/MF_TimeTable_${this.languageService.selectedLanguage}_Global.pdf`;
    this.volunteerShiftService.getLongtextOveralInfos().subscribe(ni => {
      this.longTextInfos = ni.text;
    });

    this.infoService.getSponsors().subscribe(s => this.sponsors = s);
  }

}
