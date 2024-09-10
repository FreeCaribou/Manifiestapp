import { Component } from '@angular/core';
import { ISpeaker } from 'src/app/shared/models/Event.interface';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
    selector: 'app-speakers-list-page',
    templateUrl: './speakers-list.page.html',
})
export class SpeakerListPage {

    speakers: ISpeaker[] = [];

    constructor(private programmeService: ProgrammeService) { }

    ionViewDidEnter() {
        this.programmeService.getSpeakers().subscribe(data => {
            this.speakers = data;
        });
    }

}
