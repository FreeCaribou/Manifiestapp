import { Component, Input } from '@angular/core';
import { Network } from '@capacitor/network';
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

  connected = false;

  constructor(private programmeService: ProgrammeService, public translate: TranslateService) {
    Network.getStatus().then(n => {
      this.connected = n.connected;
    });
  }

  onCardHeartClick(event: EventInterface) {
    this.programmeService.changeFavorite(event);
  }
}
