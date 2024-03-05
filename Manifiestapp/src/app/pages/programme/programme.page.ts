import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-programme',
  templateUrl: './programme.page.html',
  // styles: ['* {background-color: var(--ion-color-background);}']
})
export class ProgrammePage {
  // for the internet connection
  connected = true;

  firstEventType = '';
  firstEventLocalisation = '';

  constructor(
    private router: Router,
    public loadingCommunication: LoadingCommunicationService,
    private programmeService: ProgrammeService,
  ) { }

  ionViewWillEnter() {
    forkJoin([
      this.programmeService.getEventTypes(),
      this.programmeService.getEventLocalisations(),
    ]).subscribe(([eventTypes, eventLocalisations]) => {
      this.firstEventType = eventTypes[0];
      this.firstEventLocalisation = eventLocalisations[0];
    });
    if (!this.router.url.includes('subprogramme')) {
      this.router.navigate(['programme', 'subprogramme', 'date', 'sat']);
    }
  }

  isTabSelected(d): boolean {
    return this.router.url.includes(d);
  }

}
