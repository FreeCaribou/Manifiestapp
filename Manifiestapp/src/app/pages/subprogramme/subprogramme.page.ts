import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-subprogramme',
  templateUrl: './subprogramme.page.html',
  styleUrls: ['./subprogramme.page.scss'],
})
export class SubprogrammePage implements OnInit {
  day: EventDayEnum;
  list: EventInterface[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private programmeService: ProgrammeService,
  ) { }

  ngOnInit() {
    this.day = this.activatedRoute.snapshot.data.day;

    this.programmeService.getAllProgrammeFilter(this.day).subscribe(data => {
      console.log('data', data, data.events[0])
      this.list = data.events;
    });
  }

}
