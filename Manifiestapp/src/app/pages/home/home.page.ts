import { Component } from '@angular/core';
import { IEvent, ISpeaker } from 'src/app/shared/models/Event.interface';
import { NewInfoInterface } from 'src/app/shared/models/NewInfo.interface';
import { NewsListService } from 'src/app/shared/services/data/news-list/news-list.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';
import { VolunteerShiftService } from 'src/app/shared/services/data/volunteer-shift/volunteer-shift.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
})
export class HomePage {

  news: NewInfoInterface[] = [];
  loadNews = false;
  isNow = false;

  manifiestaDate = new Date('2024-09-07T09:00:00').getTime();
  diffDays: number;
  diffHours: number;
  diffMinutes: number;
  diffSeconds: number;

  longTextHome = '';

  topProgramme: IEvent[] = [];
  topSpeakers: ISpeaker[] = [];

  constructor(
    private volunteerShiftService: VolunteerShiftService,
    private programmeService: ProgrammeService,
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
    })

    this.count();
    setInterval(() => {
      this.count();
    }, 1000);

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
    const now = new Date().getTime();
    if (now > this.manifiestaDate) {
      this.isNow = true;
    }
    const distance = this.manifiestaDate - now;
    this.diffDays = Math.floor(distance / (1000 * 60 * 60 * 24));
    this.diffHours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.diffMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    this.diffSeconds = Math.floor((distance % (1000 * 60)) / 1000);
  }

}
