import { Component } from '@angular/core';
import { NewInfoInterface } from 'src/app/shared/models/NewInfo.interface';
import { NewsListService } from 'src/app/shared/services/data/news-list/news-list.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  news: NewInfoInterface[] = [];
  loadNews = false;

  constructor(
    private newsListService: NewsListService,
  ) {}

  manifiestaDate = new Date('2022-09-17T09:00:00').getTime();
  diffDays: number;
  diffHours: number;
  diffMinutes: number;
  diffSeconds: number;

  ionViewDidEnter() {
    this.count();
    setInterval(() => {
      this.count();
    }, 1000);

    this.loadNews = true;
    this.newsListService.getInfos(true).subscribe(n => {
      this.news = n;
    }).add(() => { this.loadNews = false; });
  }

  count() {
    const now = new Date().getTime();
    const distance = this.manifiestaDate - now;
    this.diffDays = Math.floor(distance / (1000 * 60 * 60 * 24));
    this.diffHours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.diffMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    this.diffSeconds = Math.floor((distance % (1000 * 60)) / 1000);
  }

}
