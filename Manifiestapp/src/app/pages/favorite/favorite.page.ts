import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnDestroy {
  list: EventInterface[];

  favorieChangeEmit: Subscription;

  isLoading = true;

  dateJustWithHour = false;

  constructor(
    private programmeService: ProgrammeService,
  ) { }

  ionViewWillEnter() {
    this.isLoading = true;
    this.favorieChangeEmit = this.programmeService.favoriteChangeEmit.subscribe(() => this.fetchData())
    this.fetchData();
  }

  fetchData() {
    this.programmeService.getFavoriteProgramme().subscribe(data => {
      this.list = data;
      this.isLoading = false;
    });
  }

  ionViewWillLeave() {
    this.list = [];
  }

  ngOnDestroy() {
    if (this.favorieChangeEmit) {
      this.favorieChangeEmit.unsubscribe();
    }
  }

}
