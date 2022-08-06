import { Component, Input, OnInit } from '@angular/core';
import { EventInterface } from '../../models/Event.interface';
import { ProgrammeService } from '../../services/data/programme/programme.service';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
})
export class EventCardComponent implements OnInit {
  @Input()
  event: EventInterface;
  @Input()
  dateJustWithHour = true;

  connected = false;

  constructor(private programmeService: ProgrammeService) {
    Network.getStatus().then(n => {
      this.connected = n.connected;
    });
   }

  ngOnInit() { }

  onCardHeartClick(event: EventInterface) {
    this.programmeService.changeFavorite(event);
  }

}
