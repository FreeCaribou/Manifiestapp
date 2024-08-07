import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEvent } from 'src/app/shared/models/Event.interface';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-subprogramme-localisation',
  templateUrl: './subprogramme-localisation.page.html',
})
export class SubprogrammeLocalisationPage {
  place: string;
  list: IEvent[] = [];
  listToShow: IEvent[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private programmeService: ProgrammeService,
    public loadingCommunication: LoadingCommunicationService
  ) { }

  ionViewWillEnter() {
    this.place = this.activatedRoute.snapshot.params.place;

    this.initList();
    this.programmeService.cacheBigBlobProgrammeChangeEmit$.subscribe(() => {
      this.initList();
    });
  }

  initList() {
    if (this.programmeService.cacheBigBlobProgramme.length === 0) {
      this.programmeService.getEvents().subscribe(() => {
        this.buildList();
      })
    } else {
      this.buildList();
    }
  }

  buildList() {
    // TODO check if we make filter
    this.list = this.programmeService.cacheBigBlobProgramme.filter(p => p.field_occurrence.location?.title === this.place);
    this.listToShow = this.list;
  }

  ionViewWillLeave() {
    this.list = [];
  }
}
