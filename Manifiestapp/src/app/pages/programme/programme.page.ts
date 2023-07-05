import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { InfoListService } from 'src/app/shared/services/data/info-list/info-list.service';
import { Network } from '@capacitor/network';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-programme',
  templateUrl: './programme.page.html',
})
export class ProgrammePage {
  days: any[] = [];

  // for the internet connection
  connected = true;

  constructor(
    private infoListService: InfoListService,
    private router: Router,
    public loadingCommunication: LoadingCommunicationService,
    private programmeService: ProgrammeService,
  ) { }

  ionViewWillEnter() {
    // Network.getStatus().then(n => {
    //   this.connected = n.connected;
    //   if (this.connected) {
    //     this.loadingCommunication.changeLoaderTo(true);
    //     this.infoListService.getDays().subscribe(data => {
    //       this.setDays(data);
    //     }).add(() => { this.loadingCommunication.changeLoaderTo(false); });
    //   } else {
    //     this.setDays(this.infoListService.getOfflineDaysList())
    //   }
    // });

    this.loadingCommunication.changeLoaderTo(true);
    this.programmeService.getBigBlobAllProgramme().pipe().subscribe(data => {
      data.items.forEach(item => {
        let day = item.api_event_dates[0].day;
        if (!this.days.includes(day)) {
          this.days.push(day);
        }
      });

      if (!this.router.url.includes('subprogramme')) {
        this.router.navigate(['programme', 'subprogramme', this.days[0]]);
      }
    }).add(() => {this.loadingCommunication.changeLoaderTo(false);});
  }

  // The data from WP don't come always in right order for the days
  // We look for the slug, kind of WP id
  // Slug will be day-<number of the day event>-lang(nl||fr)
  setDays(data: any[]) {
    this.days = data.sort((a, b) => {
      return a.slug < b.slug ? -1 : 1;
    });
    if (!this.router.url.includes('subprogramme')) {
      this.router.navigate(['programme', 'subprogramme', data[0]?.id]);
    }
  }

  ionViewWillLeave() {
    this.days = [];
  }

  isTabSelected(d): boolean {
    return this.router.url.includes(d);
  }

}
