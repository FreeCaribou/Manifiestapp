import { Component, Input } from '@angular/core';
import { ISpeaker } from '../../models/Event.interface';

@Component({
  selector: 'app-speaker-list',
  templateUrl: './speaker-list.component.html',
})
export class SpeakerListComponent {
  @Input()
  list: ISpeaker[];
  @Input() simpleList = false;
}
