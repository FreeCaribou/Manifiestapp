import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

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
