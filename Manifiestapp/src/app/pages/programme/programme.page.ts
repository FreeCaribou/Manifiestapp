import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-programme',
  templateUrl: './programme.page.html',
})
export class ProgrammePage {
  // for the internet connection
  connected = true;

  constructor(
    private router: Router,
    public loadingCommunication: LoadingCommunicationService,
    private programmeService: ProgrammeService,
  ) { }

  ionViewWillEnter() {
    if (!this.router.url.includes('subprogramme')) {
      this.router.navigate(['programme', 'subprogramme', 'date', 'sat']);
    }
  }

  isTabSelected(d): boolean {
    return this.router.url.includes(d);
  }

}
