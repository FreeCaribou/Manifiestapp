import { Component, Input, OnInit } from '@angular/core';
import { EventInterface } from '../../models/Event.interface';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
})
export class EventCardComponent implements OnInit {
  @Input()
  event: EventInterface;

  constructor() { }

  ngOnInit() { }

}
