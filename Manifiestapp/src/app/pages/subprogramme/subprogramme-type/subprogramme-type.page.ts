import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEvent } from 'src/app/shared/models/Event.interface';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-subprogramme-type',
  templateUrl: './subprogramme-type.page.html',
})
export class SubprogrammeTypePage {
  type: string;
  list: IEvent[] = [];
  listToShow: IEvent[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private programmeService: ProgrammeService,
    public loadingCommunication: LoadingCommunicationService
  ) { }

  ionViewWillEnter() {
    this.type = this.activatedRoute.snapshot.params.type;

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
    this.list = this.programmeService.cacheBigBlobProgramme.filter(p => p.field_type.name === this.type).sort((a,b) => {
        return a.field_occurrence?.start > b.field_occurrence?.start ? 1 : -1;
    });
    this.listToShow = this.list;
  }

  ionViewWillLeave() {
    this.list = [];
  }
}
