import { Component, Input } from '@angular/core';
import { EventInterface, WagtailApiEventItem } from '../../models/Event.interface';

@Component({
  selector: 'app-event-list-card',
  templateUrl: './event-list-card.component.html',
})
export class EventListCardComponent {
  @Input()
  list: WagtailApiEventItem[];
  @Input()
  dateJustWithHour = true;
}
