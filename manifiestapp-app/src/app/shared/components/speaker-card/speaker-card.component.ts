import { Component, Input } from '@angular/core';
import { ISpeaker } from '../../models/Event.interface';

@Component({
  selector: 'app-speaker-card',
  templateUrl: './speaker-card.component.html',
})
export class SpeakerCardComponent {
  @Input()
  speaker: ISpeaker;
}
