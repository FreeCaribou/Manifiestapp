import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-subprogramme-type-tab',
  templateUrl: './subprogramme-type-tab.page.html',
})
export class SubprogrammeTypeTabPage {
  types: any[] = [];

  constructor(
    private programmeService: ProgrammeService,
    public loadingCommunication: LoadingCommunicationService,
    private router: Router,
  ) { }

  ionViewWillEnter() {
    this.loadingCommunication.changeLoaderTo(true);
    this.programmeService.getEventTypes().subscribe(data => {
      this.types = data;
    })
    .add(() => this.loadingCommunication.changeLoaderTo(false));
  }

  isTabSelected(d): boolean {
    return decodeURIComponent(this.router.url).includes(d);
  }
}
