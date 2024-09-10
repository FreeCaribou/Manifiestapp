import { Component, OnInit } from '@angular/core';
import { IFaq } from 'src/app/shared/models/FAQ.interface';
import { LanguageCommunicationService } from 'src/app/shared/services/communication/language.communication.service';
import { InfoListService } from 'src/app/shared/services/data/info-list/info-list.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';
import { VolunteerShiftService } from 'src/app/shared/services/data/volunteer-shift/volunteer-shift.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
})
export class AboutPage {

  longTextInfos = '';
  urlShuttleInfo = '';
  urlPlanning = '';
  FAQs: IFaq[] = [];

  sponsors = [];

  constructor(
    private volunteerShiftService: VolunteerShiftService,
    private languageService: LanguageCommunicationService,
    private infoService: InfoListService,
    private programmeService: ProgrammeService,
  ) { }
  
  ionViewDidEnter() {
    this.urlShuttleInfo = `https://manifiesta.be/${this.languageService.selectedLanguage}/news/shuttle-info/`;
    this.urlPlanning = `http://whoissamy.be/MF_TimeTable_${this.languageService.selectedLanguage}_Global.pdf`;
    this.volunteerShiftService.getLongtextOveralInfos().subscribe(ni => {
      this.longTextInfos = ni.text;
    });

    this.infoService.getSponsors().subscribe(s => this.sponsors = s);

    this.programmeService.getFAQ().subscribe(data => {
      console.log('data', data)
      this.FAQs = data;
    })
  }

}
