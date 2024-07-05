import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { IEvent } from 'src/app/shared/models/Event.interface';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-subprogramme-localisation-tab',
  templateUrl: './subprogramme-localisation-tab.page.html',
})
export class SubprogrammeLocalisationTabPage {
  localisations: any[] = [];
  locatieSelected: any;

  list: IEvent[];
  listToShow: IEvent[];

  constructor(
    private programmeService: ProgrammeService,
    public loadingCommunication: LoadingCommunicationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ionViewWillEnter() {
    this.loadingCommunication.changeLoaderTo(true);
    forkJoin([
      this.programmeService.getEventLocalisations(),
      this.programmeService.getEvents(),
    ])
    .subscribe(([localisations, data]) => {
      this.localisations = localisations.map(i => { return { id: i, name: i } }).filter(x => x.name && x.id);
      this.list = data;
      if (this.activatedRoute.snapshot.queryParams?.place) {
        const decodedQueryParamPlace = decodeURIComponent(this.activatedRoute.snapshot.queryParams.place);
        if (this.localisations.find(l => l.id == decodedQueryParamPlace)) {
          this.locatieSelected = decodedQueryParamPlace;
        } else {
          this.locatieSelected = this.localisations[0]?.id;
        }
      } else {
        this.locatieSelected = this.localisations[0]?.id;
      }
      this.onSelectChange();
    })
    .add(() => this.loadingCommunication.changeLoaderTo(false));
  }

  onSelectChange() {
    if (this.locatieSelected) {
      this.listToShow = this.list.filter(e => e.field_occurrence.field_location.title == this.locatieSelected);
    }
  }

  isTabSelected(d): boolean {
    return decodeURIComponent(this.router.url).includes(d);
  }
}
