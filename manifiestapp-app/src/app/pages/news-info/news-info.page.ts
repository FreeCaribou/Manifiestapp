import { Component } from '@angular/core';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { NewsListService } from 'src/app/shared/services/data/news-list/news-list.service';
import { Network } from '@capacitor/network';
import { VolunteerShiftService } from 'src/app/shared/services/data/volunteer-shift/volunteer-shift.service';

@Component({
  selector: 'app-news-info',
  templateUrl: './news-info.page.html',
})
export class NewsInfoPage {
  list = [];

  longTextNewInfos = '';

  constructor(
    private newsListService: NewsListService,
    public loadingCommunication: LoadingCommunicationService,
    private volunteerShiftService: VolunteerShiftService,
  ) { }

  ionViewDidEnter() {
    this.volunteerShiftService.getLongtextNewInfos().subscribe(ni => {
      this.longTextNewInfos = ni.text;
    });
    // Network.getStatus().then(n => {
    //   if (n.connected) {
    //     this.loadingCommunication.changeLoaderTo(true);
    //     this.newsListService.getInfos().subscribe(d => {
    //       this.list = d;
    //     }).add(() => { this.loadingCommunication.changeLoaderTo(false); });
    //   }
    // })
  }

}
