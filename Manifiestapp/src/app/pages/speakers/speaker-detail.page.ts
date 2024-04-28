import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISpeaker } from 'src/app/shared/models/Event.interface';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
    selector: 'app-speaker-detail-page',
    templateUrl: './speaker-detail.page.html',
})
export class SpeakerDetailPage {

    id: string;
    speaker: ISpeaker;
    defaultHref = '/speakers';

    constructor(
        private programmeService: ProgrammeService,
        private activatedRoute: ActivatedRoute,
    ) { }

    ionViewDidEnter() {
        this.id = this.activatedRoute.snapshot.params.id;
        this.programmeService.getSpeaker(this.id).subscribe(data => {
            this.speaker = data;
        });
    }

}
