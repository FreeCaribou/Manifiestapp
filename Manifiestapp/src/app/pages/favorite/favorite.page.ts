import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { LoaderCommunicationService } from 'src/app/shared/services/communication/loader.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit, OnDestroy {
  list: EventInterface[];

  favorieChangeEmit: Subscription;

  constructor(
    private programmeService: ProgrammeService,
    public loaderCommunication: LoaderCommunicationService
  ) { }

  ngOnInit() {
    this.favorieChangeEmit = this.programmeService.favoriteChangeEmit.subscribe(() => this.fetchData())
    this.fetchData();
  }

  fetchData() {
    this.loaderCommunication.isLoading = true;
    this.programmeService.getFavoriteProgramme().subscribe(data => {
      this.list = data.events;
      this.loaderCommunication.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.favorieChangeEmit) {
      this.favorieChangeEmit.unsubscribe();
    }
  }

}
