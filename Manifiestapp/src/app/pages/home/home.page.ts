import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  list = [];

  constructor(private httpClient: HttpClient) {}

  ionViewWillEnter() {
    this.httpClient.get<any[]>('https://manifiestback.herokuapp.com/testcors').subscribe(data => {
      console.log('hello', data)
      this.list = data;
    });
  }

}
