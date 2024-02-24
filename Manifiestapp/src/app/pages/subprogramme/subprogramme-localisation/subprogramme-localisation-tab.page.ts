import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-subprogramme-localisation-tab',
  templateUrl: './subprogramme-localisation-tab.page.html',
})
export class SubprogrammeLocalisationTabPage {
  localisations: any[] = [];

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
        let localisation = d.field_occurrence?.field_location.title;
        if (!this.localisations.includes(localisation)) {
          this.localisations.push(localisation);
        }
      });
    }).add(() => this.loadingCommunication.changeLoaderTo(false));
  }

  isTabSelected(d): boolean {
    return decodeURIComponent(this.router.url).includes(d);
  }
}
