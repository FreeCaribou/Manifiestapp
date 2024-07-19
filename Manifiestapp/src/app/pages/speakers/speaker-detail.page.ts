import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { IEvent, ISpeaker } from 'src/app/shared/models/Event.interface';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
    selector: 'app-speaker-detail-page',
    templateUrl: './speaker-detail.page.html',
})
export class SpeakerDetailPage {

    id: string;
    speaker: ISpeaker;
    defaultHref = '/speakers';
    linkedEvents: IEvent[] = [];

    constructor(
        private programmeService: ProgrammeService,
        private activatedRoute: ActivatedRoute,
    ) { }

    ionViewDidEnter() {
        this.id = this.activatedRoute.snapshot.params.id;
        this.programmeService.getSpeaker(this.id).subscribe(data => {
            this.speaker = data;
            forkJoin(this.speaker.related_events.map(sre => this.programmeService.getEventsByParentId(sre.uuid))).subscribe(events => {
                try {
                    events.forEach(e => e.forEach(ee => this.linkedEvents.push(ee)))
                } catch (error) { }
            });
        });
    }

}
