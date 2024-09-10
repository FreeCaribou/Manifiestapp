import { Component, Input } from '@angular/core';
import { IEvent } from '../../models/Event.interface';

@Component({
  selector: 'app-event-list-card',
  templateUrl: './event-list-card.component.html',
  // styles: ['* {background-color: var(--ion-color-background);}']
})
export class EventListCardComponent {
  @Input()
  list: IEvent[];
  @Input()
  dateJustWithHour = true;
  @Input()
  showLocalisation = true;
  @Input()
  showType = true;
  @Input() simpleList = false;
  @Input() withBackground = true;
}
