import { Component, Input, OnInit } from '@angular/core';
import { EventInterface } from '../../models/Event.interface';
import { ProgrammeService } from '../../services/data/programme/programme.service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
})
export class EventCardComponent implements OnInit {
  @Input()
  event: EventInterface;

  constructor(private programmeService: ProgrammeService) { }

  ngOnInit() { }

  onCardHeartClick(event: EventInterface) {
    this.programmeService.changeFavorite(event);
  }

}
