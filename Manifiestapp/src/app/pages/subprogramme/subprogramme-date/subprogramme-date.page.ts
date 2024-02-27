import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { IEvent } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-subprogramme-date',
  templateUrl: './subprogramme-date.page.html',
})
export class SubprogrammeDatePage {
  dayId: string;
  list: IEvent[];
  listToShow: IEvent[];
  day: EventDayEnum;

  locaties: any[];
  locatieSelected: any;
  // Type in the backend taxonomy
  categories: any[];
  categorieSelected: any;
  languages: any[];
  languageSelected: any;
  // Category in the backend taxonomy
  subcategories: any[];
  subcategorieSelected: any;
  search: string;
  // organizers: any[];
  // organizerSelected: any;

  showFilters = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private programmeService: ProgrammeService,
    public loadingCommunication: LoadingCommunicationService
  ) { }

  ionViewWillEnter() {
    this.dayId = this.activatedRoute.snapshot.params.dayId;

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
    forkJoin([
      this.programmeService.getEventTypes(),
      this.programmeService.getEventLocalisations(),
    ]).subscribe(([eventTypes, eventLocalisations]) => {
      this.list = this.programmeService.cacheBigBlobProgramme.filter(p => p.field_occurrence.field_day === this.dayId);
      this.listToShow = this.list;
      this.locaties = eventLocalisations.map(i => { return { id: i, name: i } });
      this.categories = eventTypes.map(i => { return { id: i, name: i } });
      const langBrut = [].concat(...this.list.map(l => l.field_language.map(v => { return { id: v.name, name: v.name } })))
      this.languages = [... new Map(langBrut.map((m) => [m.id, m])).values()].sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });
    });


    // TODO rebuild that for the subcategorie (categorie in the back) also in the search !
    // this.categories = [... new Set(
    //   this.list.map(i => i.api_categories.primary.join()).filter(i => i).join().split(',')
    //     .concat(this.list.map(i => i.api_categories.secondary.join()).filter(i => i).join().split(','))
    // )].map(i => { return { id: i, name: i } }).sort((a, b) => {
    //   return a.name > b.name ? 1 : -1;
    // });
  }

  onSelectChange() {
    this.makeFilter();
  }

  ionViewWillLeave() {
    this.list = [];
  }

  onSearchChange() {
    this.makeFilter();
  }

  makeFilter() {
    this.listToShow = this.list;

    if (this.search && this.search?.trim() !== '') {
      this.listToShow = this.listToShow.filter(
        x => x.title.toLowerCase().includes(this.search.toLowerCase())
      );
    }

    if (this.locatieSelected) {
      this.listToShow = this.listToShow.filter(e => e.field_occurrence.field_location.title == this.locatieSelected);
    }

    if (this.categorieSelected) {
      this.listToShow = this.listToShow.filter(e =>e.field_type.name == this.categorieSelected);
    }

    if (this.languageSelected) {
      this.listToShow = this.listToShow.filter(l => l.field_language.findIndex(x => x.name === this.languageSelected) > -1);
    }

    // TODO search for subcategorie
  }
}
