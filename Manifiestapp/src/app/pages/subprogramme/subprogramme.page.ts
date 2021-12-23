import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';
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

  isLoading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private programmeService: ProgrammeService,
    private infoListService: InfoListService,
  ) { }

  ionViewWillEnter() {
    this.isLoading = true;
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

      this.isLoading = false;
    });
  }

  onSelectChange() {
    this.isLoading = true;
    this.programmeService.getAllProgrammeFilter(
      [this.dayId],
      this.locatieSelected ? [this.locatieSelected] : null,
      this.categorieSelected ? [this.categorieSelected] : null,
      this.organizerSelected ? [this.organizerSelected] : null,
    ).subscribe(data => {
      this.list = data;
      this.isLoading = false;
    });
  }

  ionViewWillLeave() {
    this.list = [];
  }

}
