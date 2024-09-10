import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewInfoInterface } from 'src/app/shared/models/NewInfo.interface';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { NewsListService } from 'src/app/shared/services/data/news-list/news-list.service';

@Component({
  selector: 'app-new-detail',
  templateUrl: './new-detail.page.html',
})
export class NewDetailPage {
  id: string;
  newInfo: NewInfoInterface;

  defaultHref = '/home';

  constructor(
    private activatedRoute: ActivatedRoute,
    private newsListService: NewsListService,
    public loadingCommunication: LoadingCommunicationService,
  ) { }

  ionViewDidEnter() {
    this.loadingCommunication.changeLoaderTo(true);
    this.id = this.activatedRoute.snapshot.params.id;
    this.newsListService.getInfo(this.id).subscribe(d => {
      this.newInfo = d;
    }).add(() => { this.loadingCommunication.changeLoaderTo(false); });
  }

}
