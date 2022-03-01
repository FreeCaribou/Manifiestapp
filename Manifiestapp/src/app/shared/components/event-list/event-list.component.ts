import { Component, Input } from '@angular/core';
import { EventInterface } from '../../models/Event.interface';
import { ProgrammeService } from '../../services/data/programme/programme.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
})
export class EventListComponent {
  @Input()
  list: EventInterface[];
  @Input()
  dateJustWithHour = true;

  constructor(private programmeService: ProgrammeService) {}

  onCardHeartClick(event: EventInterface) {
    this.programmeService.changeFavorite(event);
  }
}
