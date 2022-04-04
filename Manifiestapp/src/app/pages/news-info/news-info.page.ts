import { Component, OnInit } from '@angular/core';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { NewsListService } from 'src/app/shared/services/data/news-list/news-list.service';

@Component({
  selector: 'app-news-info',
  templateUrl: './news-info.page.html',
  styleUrls: ['./news-info.page.scss'],
})
export class NewsInfoPage {
  list = [];

  constructor(
    private newsListService: NewsListService,
    public loadingCommunication: LoadingCommunicationService,
  ) { }

  ionViewDidEnter() {
    this.loadingCommunication.changeLoaderTo(true);
    this.newsListService.getInfos().subscribe(d => {
      this.list = d;
    }).add(() => { this.loadingCommunication.changeLoaderTo(false); });
  }

}
