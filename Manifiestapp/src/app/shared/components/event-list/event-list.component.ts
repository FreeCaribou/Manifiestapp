import { Component, Input } from '@angular/core';
import { Network } from '@capacitor/network';
import { TranslateService } from '@ngx-translate/core';
import { DayListEventInterface, EventInterface, WagtailApiEventItem, WagtailApiEventItemDaysList } from '../../models/Event.interface';
import { ProgrammeService } from '../../services/data/programme/programme.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
})
export class EventListComponent {
  @Input()
  list: WagtailApiEventItemDaysList[];
  @Input()
  dateJustWithHour = true;

  connected = false;

  constructor(private programmeService: ProgrammeService, public translate: TranslateService) {
    Network.getStatus().then(n => {
      this.connected = n.connected;
    });
  }

  onCardHeartClick(event: any) {
    this.programmeService.changeFavorite(event);
  }
}
