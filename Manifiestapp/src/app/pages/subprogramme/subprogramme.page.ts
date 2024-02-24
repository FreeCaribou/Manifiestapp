import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEvent } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-subprogramme',
  templateUrl: './subprogramme.page.html',
})
export class SubprogrammePage {
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
    this.list = this.programmeService.cacheBigBlobProgramme.filter(p => p.field_occurrence.field_day === this.dayId);
    this.listToShow = this.list;

    this.locaties = [... new Set(this.list.map(i => i.field_occurrence.field_location.title))].map(i => { return { id: i, name: i } }).sort((a, b) => {
      return a.name > b.name ? 1 : -1;
    });

    this.categories = [... new Set(this.list.map(i => i.field_type.name))].map(i => { return { id: i, name: i } }).sort((a, b) => {
      return a.name > b.name ? 1 : -1;
    });

    const langBrut = [].concat(...this.list.map(l => l.field_language.map(v => { return { id: v.name, name: v.name } })))
    this.languages = [... new Map(langBrut.map((m) => [m.id, m])).values()].sort((a, b) => {
      return a.name > b.name ? 1 : -1;
    });

    // TODO rebuild that for the subcategorie (categorie in the back) also in the search !
    // this.categories = [... new Set(
    //   this.list.map(i => i.api_categories.primary.join()).filter(i => i).join().split(',')
    //     .concat(this.list.map(i => i.api_categories.secondary.join()).filter(i => i).join().split(','))
    // )].map(i => { return { id: i, name: i } }).sort((a, b) => {
    //   return a.name > b.name ? 1 : -1;
    // });

    const preSelectLocatie = this.activatedRoute.snapshot?.queryParams?.locatie;
    const included = this.locaties.map(x => x.name).includes(preSelectLocatie)
    console.log('hallo world', this.activatedRoute.snapshot.queryParams, this.locaties, preSelectLocatie, included)
    if (!!preSelectLocatie && included) {
      this.locatieSelected = preSelectLocatie;
      this.makeFilter();
    }
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
