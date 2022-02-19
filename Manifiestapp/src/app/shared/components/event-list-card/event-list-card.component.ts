import { Component, Input, OnInit } from '@angular/core';
import { EventInterface } from '../../models/Event.interface';

@Component({
  selector: 'app-event-list-card',
  templateUrl: './event-list-card.component.html',
})
export class EventListCardComponent implements OnInit {
  @Input()
  list: EventInterface[];
  @Input()
  dateJustWithHour = true;

  ngOnInit() {

  }

}
