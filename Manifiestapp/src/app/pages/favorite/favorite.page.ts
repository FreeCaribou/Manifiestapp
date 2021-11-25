import { Component, OnInit } from '@angular/core';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {
  list: EventInterface[];

  constructor(private programmeService: ProgrammeService) { }

  ngOnInit() {
    this.programmeService.favoriteChangeEmit.subscribe(() => this.fetchData())
    this.fetchData();
  }

  fetchData() {
    this.programmeService.getFavoriteProgramme().subscribe(data => {
      this.list = data.events;
    });
  }

}
