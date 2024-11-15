import { Component } from '@angular/core';
import { IEvent, ISpeaker } from 'src/app/shared/models/Event.interface';
import { NewInfoInterface } from 'src/app/shared/models/NewInfo.interface';
import { LanguageCommunicationService } from 'src/app/shared/services/communication/language.communication.service';
import { InfoListService } from 'src/app/shared/services/data/info-list/info-list.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';
import { VolunteerShiftService } from 'src/app/shared/services/data/volunteer-shift/volunteer-shift.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
})
export class HomePage {

  news: NewInfoInterface[] = [];
  loadNews = false;

  manifiestaDateBegin = null;
  manifiestaDateEnd = null;
  diffDays: number;
  diffHours: number;
  diffMinutes: number;
  diffSeconds: number;

  longTextHome = '';

  topProgramme: IEvent[] = [];
  topSpeakers: ISpeaker[] = [];

  generalInfoData: any = {};

  get isEventLater(): boolean {
    const now = new Date().getTime();
    if (this.manifiestaDateBegin && this.manifiestaDateEnd) {
      return now < new Date(this.manifiestaDateBegin).getTime();
    }
    return false;
  }

  get isEventNow(): boolean {
    const now = new Date().getTime();
    if (this.manifiestaDateBegin && this.manifiestaDateEnd) {
      return now > new Date(this.manifiestaDateBegin).getTime() && now < new Date(this.manifiestaDateEnd).getTime();
    }
    return false;
  }

  get isEventPast(): boolean {
    const now = new Date().getTime();
    if (this.manifiestaDateBegin && this.manifiestaDateEnd) {
      return now > new Date(this.manifiestaDateEnd).getTime()
    }
    return false;
  }

  get mapPlanLink(): string {
    if (this.generalInfoData?.event_info?.plan) {
      try {
        return this.generalInfoData?.event_info?.plan?.[this.languageService.selectedLanguage]?.url;
      } catch(e) {
        return null;
      }
    }
    return null;
  }

  constructor(
    private volunteerShiftService: VolunteerShiftService,
    private programmeService: ProgrammeService,
    private infoListService: InfoListService,
    private languageService: LanguageCommunicationService,
  ) { }

  ionViewDidEnter() {
    this.volunteerShiftService.getLongtextHome().subscribe(textHome => {
      this.longTextHome = textHome.text;
    });

    this.programmeService.getEventsTopX(3).subscribe(mainEvents => {
      this.topProgramme = mainEvents;
    });

    this.programmeService.getSpeakersTopX(3).subscribe(mainSpeakers => {
      this.topSpeakers = mainSpeakers;
    });

    this.infoListService.getGeneralInfo().subscribe(data => {
      this.generalInfoData = data;

      this.manifiestaDateBegin = this.generalInfoData?.event_info?.timing?.start;
      this.manifiestaDateEnd = this.generalInfoData?.event_info?.timing?.end;

      this.count();
      setInterval(() => {
        this.count();
      }, 1000);
    });



    // Network.getStatus().then(n => {
    //   if (n.connected) {
    //     this.loadNews = true;
    //     this.newsListService.getInfos(true).subscribe(n => {
    //       this.news = n;
    //     }).add(() => { this.loadNews = false; });
    //   }
    // });
  }

  count() {
    if (this.manifiestaDateBegin) {
      const date = new Date(this.manifiestaDateBegin).getTime();
      const now = new Date().getTime();
      const distance = date - now;
      this.diffDays = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.diffHours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.diffMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.diffSeconds = Math.floor((distance % (1000 * 60)) / 1000);
    }
  }

}
