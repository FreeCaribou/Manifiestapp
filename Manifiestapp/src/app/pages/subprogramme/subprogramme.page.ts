import { Component, OnInit } from '@angular/core';
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
export class SubprogrammePage implements OnInit {
  day: EventDayEnum;
  list: EventInterface[];
  venues: any[];
  organizers: any[];
  eventCategories: any[];

  isLoading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private programmeService: ProgrammeService,
    private infoListService: InfoListService,
  ) { }

  ngOnInit() {
    this.day = this.activatedRoute.snapshot.data.day;

    forkJoin([
      this.programmeService.getAllProgrammeFilter(this.day),
      this.infoListService.getVenues(),
      this.infoListService.getOrganizers(),
      this.infoListService.getEventCategories(),
    ]).subscribe(datas => {
      console.log('datas', datas)
      this.list = datas[0].events;
      this.venues = datas[1];
      this.organizers = datas[2];
      this.eventCategories = datas[3];

      this.isLoading = false;
    });
  }

}
