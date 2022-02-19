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

  haveConflict = false;

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
      this.haveConflict = this.list.findIndex(e => e.inFavoriteConflict) > -1;
      this.isLoading = false;
    });
  }

  onCardHeartClick(event: EventInterface) {
    this.programmeService.changeFavorite(event);
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
