import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';
import { LoaderCommunicationService } from 'src/app/shared/services/communication/loader.communication.service';
import { InfoListService } from 'src/app/shared/services/data/info-list/info-list.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-subprogramme',
  templateUrl: './subprogramme.page.html',
  styleUrls: ['./subprogramme.page.scss'],
})
export class SubprogrammePage implements OnInit {
  list: EventInterface[];
  day: EventDayEnum;
  venues: any[];
  venueSelected: any;
  organizers: any[];
  organizerSelected: any;
  eventCategories: any[];
  eventCategorieSelected: any;

  showFilters = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private programmeService: ProgrammeService,
    private infoListService: InfoListService,
    public loaderCommunication: LoaderCommunicationService
  ) { }

  ngOnInit() {
    this.day = this.activatedRoute.snapshot.data.day;

    this.loaderCommunication.isLoading = true;
    forkJoin([
      this.programmeService.getAllProgrammeFilter(this.day),
      this.infoListService.getVenues(),
      this.infoListService.getOrganizers(),
      this.infoListService.getEventCategories(),
    ]).subscribe(datas => {
      this.list = datas[0].events;
      this.venues = datas[1];
      this.organizers = datas[2];
      this.eventCategories = datas[3];

      this.loaderCommunication.isLoading = false;
    });
  }

  onSelectChange() {
    this.loaderCommunication.isLoading = true;
    this.programmeService.getAllProgrammeFilter(
      this.day,
      this.venueSelected ? [this.venueSelected] : null,
      this.organizerSelected ? [this.organizerSelected] : null,
      this.eventCategorieSelected ? [this.eventCategorieSelected] : null
    ).subscribe(data => {
      this.list = data.events;
      this.loaderCommunication.isLoading = false;
    });
  }

}
