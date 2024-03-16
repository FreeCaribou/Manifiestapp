import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-subprogramme-date-tab',
  templateUrl: './subprogramme-date-tab.page.html',
})
export class SubprogrammeDateTabPage {
  days: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private programmeService: ProgrammeService,
    public loadingCommunication: LoadingCommunicationService,
    private router: Router,
  ) { }

  ionViewWillEnter() {
    this.loadingCommunication.changeLoaderTo(true);
    this.programmeService.getEvents().subscribe(data => {
      data.forEach(d => {
        let day = d.field_occurrence?.field_day;
        if (!this.days.includes(day)) {
          this.days.push(day);
        }
      });
      console.log('dat', this.days)
      this.days = this.days.sort((a,b) => {
        return a === 'sun' ? 1 : -1;
      })

      if (!this.router.url.includes('subprogramme')) {
        this.router.navigate(['programme', 'subprogramme', 'day', this.days[0]]);
      }
    }).add(() => this.loadingCommunication.changeLoaderTo(false));
  }

  isTabSelected(d): boolean {
    return this.router.url.includes(d);
  }
}
