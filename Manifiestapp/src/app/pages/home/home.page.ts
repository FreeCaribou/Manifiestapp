import { Component } from '@angular/core';
import { NewInfoInterface } from 'src/app/shared/models/NewInfo.interface';
import { NewsListService } from 'src/app/shared/services/data/news-list/news-list.service';
import { Network } from '@capacitor/network';
import { VolunteerShiftService } from 'src/app/shared/services/data/volunteer-shift/volunteer-shift.service';
import { LanguageCommunicationService } from 'src/app/shared/services/communication/language.communication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
})
export class HomePage {

  news: NewInfoInterface[] = [];
  loadNews = false;
  isNow = false;

  manifiestaDate = new Date('2023-09-09T09:00:00').getTime();
  diffDays: number;
  diffHours: number;
  diffMinutes: number;
  diffSeconds: number;

  longTextNewInfos = '';

  constructor(
    private newsListService: NewsListService,
    private volunteerShiftService: VolunteerShiftService,
  ) { }

  ionViewDidEnter() {
    this.volunteerShiftService.getLongtextNewInfos().subscribe(ni => {
      this.longTextNewInfos = ni.text;
    });

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
