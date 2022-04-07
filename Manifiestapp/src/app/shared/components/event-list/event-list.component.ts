import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DayListEventInterface, EventInterface } from '../../models/Event.interface';
import { ProgrammeService } from '../../services/data/programme/programme.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
})
export class EventListComponent {
  @Input()
  list: DayListEventInterface[];
  @Input()
  dateJustWithHour = true;

  constructor(private programmeService: ProgrammeService, public translate: TranslateService) {}

  onCardHeartClick(event: EventInterface) {
    this.programmeService.changeFavorite(event);
  }
}
