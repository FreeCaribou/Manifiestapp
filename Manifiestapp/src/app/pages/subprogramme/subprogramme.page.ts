import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EventInterface, IEvent, WagtailApiEventItem } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { InfoListService } from 'src/app/shared/services/data/info-list/info-list.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';
import { Network } from '@capacitor/network';

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
  categories: any[];
  categorieSelected: any;
  languages: any[];
  languageSelected: any;
  search: string;
  // organizers: any[];
  // organizerSelected: any;

  showFilters = false;

  // for the internet connection
  connected = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private programmeService: ProgrammeService,
    private infoListService: InfoListService,
    public loadingCommunication: LoadingCommunicationService
  ) { }

  ionViewWillEnter() {
    this.dayId = this.activatedRoute.snapshot.params.dayId;

    this.initList();
    this.programmeService.cacheBigBlobProgrammeChangeEmit$.subscribe(() => {
      this.initList();
    })

    // Network.getStatus().then(n => {
    //   this.connected = n.connected;
    //   if (this.connected) {
    //     this.loadingCommunication.changeLoaderTo(true);
    //     forkJoin([
    //       this.programmeService.getAllProgrammeFilter([this.dayId]),
    //       this.infoListService.getVenues(),
    //       this.infoListService.getEventCategories(),
    //       // this.infoListService.getOrganizers(),
    //     ]).subscribe(datas => {
    //       this.list = datas[0];
    //       this.listToShow = this.list;
    //       this.locaties = datas[1];
    //       this.categories = datas[2];
    //       // this.organizers = datas[3];
    //     }).add(() => { this.loadingCommunication.changeLoaderTo(false); });

    //     this.programmeService.verificationFavoriteLoadEmit.subscribe(load => this.loadingCommunication.changeLoaderTo(load));
    //   } else {
    //     this.list = this.programmeService.getOfflineProgrammesList([this.dayId]);
    //     this.listToShow = this.list;
    //   }
    // });
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

    console.log('and the list of the day isss', this.dayId, this.list, this.programmeService.cacheBigBlobProgramme)

    this.locaties = [... new Set(this.list.map(i => i.field_occurrence.field_location.title))].map(i => { return { id: i, name: i } }).sort((a, b) => {
      return a.name > b.name ? 1 : -1;
    });

    const langBrut = [].concat(...this.list.map(l => l.field_language.map(v => { return { id: v.name, name: v.name } })))
    this.languages = [... new Map(langBrut.map((m) => [m.id, m])).values()].sort((a, b) => {
      return a.name > b.name ? 1 : -1;
    });

    // TODO rebuild that ! and add language ...

    // this.categories = [... new Set(
    //   this.list.map(i => i.api_categories.primary.join()).filter(i => i).join().split(',')
    //     .concat(this.list.map(i => i.api_categories.secondary.join()).filter(i => i).join().split(','))
    // )].map(i => { return { id: i, name: i } }).sort((a, b) => {
    //   return a.name > b.name ? 1 : -1;
    // });
  }

  onSelectChange() {
    this.makeFilter();
    // this.loadingCommunication.changeLoaderTo(true);
    // this.programmeService.getAllProgrammeFilter(
    //   [this.dayId],
    //   this.locatieSelected ? [this.locatieSelected] : null,
    //   this.categorieSelected ? [this.categorieSelected] : null,
    //   // this.organizerSelected ? [this.organizerSelected] : null,
    // ).subscribe(data => {
    //   this.list = data;
    //   this.listToShow = this.list;
    //   this.onSearchChange();
    // }).add(() => { this.loadingCommunication.changeLoaderTo(false); });
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
      this.listToShow = this.listToShow.filter(e => e.api_location.name == this.locatieSelected);
    }

    if (this.categorieSelected) {
      this.listToShow = this.listToShow.filter(e =>
        e.api_categories.primary.includes(this.categorieSelected) || e.api_categories.secondary.includes(this.categorieSelected)
      );
    }
  }

}
