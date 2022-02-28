import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { InfoListService } from 'src/app/shared/services/data/info-list/info-list.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-subprogramme',
  templateUrl: './subprogramme.page.html',
  styleUrls: ['./subprogramme.page.scss'],
})
export class SubprogrammePage {
  dayId: string;
  list: EventInterface[];
  day: EventDayEnum;
  locaties: any[];
  locatieSelected: any;
  organizers: any[];
  organizerSelected: any;
  categories: any[];
  categorieSelected: any;

  showFilters = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private programmeService: ProgrammeService,
    private infoListService: InfoListService,
    public loadingCommunication: LoadingCommunicationService
  ) { }

  ionViewWillEnter() {
    this.loadingCommunication.changeLoaderTo(true);
    this.dayId = this.activatedRoute.snapshot.params.dayId;

    forkJoin([
      this.programmeService.getAllProgrammeFilter([this.dayId]),
      this.infoListService.getVenues(),
      this.infoListService.getEventCategories(),
      // this.infoListService.getOrganizers(),
    ]).subscribe(datas => {
      this.list = datas[0];
      this.locaties = datas[1];
      this.categories = datas[2];
      // this.organizers = datas[3];

      this.loadingCommunication.changeLoaderTo(false);
    });

    this.programmeService.verificationFavoriteLoadEmit.subscribe(load => this.loadingCommunication.changeLoaderTo(load));
  }

  onSelectChange() {
    this.loadingCommunication.changeLoaderTo(true);
    this.programmeService.getAllProgrammeFilter(
      [this.dayId],
      this.locatieSelected ? [this.locatieSelected] : null,
      this.categorieSelected ? [this.categorieSelected] : null,
      this.organizerSelected ? [this.organizerSelected] : null,
    ).subscribe(data => {
      this.list = data;
      this.loadingCommunication.changeLoaderTo(false);
    });
  }

  ionViewWillLeave() {
    this.list = [];
  }

}
