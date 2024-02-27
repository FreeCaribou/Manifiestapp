import { Component, Input, OnInit } from '@angular/core';
import { IEvent, WagtailApiEventItem } from '../../models/Event.interface';
import { ProgrammeService } from '../../services/data/programme/programme.service';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
})
export class EventCardComponent implements OnInit {
  @Input()
  event: IEvent;
  @Input()
  dateJustWithHour = true;
  @Input()
  showLocalisation = true;
  @Input()
  showType = true;

  connected = false;

  constructor(private programmeService: ProgrammeService) {
    Network.getStatus().then(n => {
      this.connected = n.connected;
    });
   }

  ngOnInit() { }

  onCardHeartClick(event: IEvent) {
    this.programmeService.changeFavorite(event);
  }

}
