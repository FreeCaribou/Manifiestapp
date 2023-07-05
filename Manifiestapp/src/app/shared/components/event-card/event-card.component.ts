import { Component, Input, OnInit } from '@angular/core';
import { WagtailApiEventItem } from '../../models/Event.interface';
import { ProgrammeService } from '../../services/data/programme/programme.service';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
})
export class EventCardComponent implements OnInit {
  @Input()
  event: WagtailApiEventItem;
  @Input()
  dateJustWithHour = true;

  connected = false;

  constructor(private programmeService: ProgrammeService) {
    Network.getStatus().then(n => {
      this.connected = n.connected;
    });
   }

  ngOnInit() { }

  onCardHeartClick(event: WagtailApiEventItem) {
    this.programmeService.changeFavorite(event);
  }

}
