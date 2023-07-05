import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EventInterface, WagtailApiEventItem } from 'src/app/shared/models/Event.interface';
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
  list: WagtailApiEventItem[];
  listToShow: WagtailApiEventItem[];
  day: EventDayEnum;
  locaties: any[];
  locatieSelected: any;
  organizers: any[];
  organizerSelected: any;
  categories: any[];
  categorieSelected: any;

  showFilters = false;

  // for the internet connection
  connected = true;

  search: string;

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
    this.list = this.programmeService.cacheBigBlobProgramme.filter(p => p.api_event_dates[0].day === this.dayId);
    this.listToShow = this.list;
  }

  onSelectChange() {
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
    // if (this.search && this.search?.trim() !== '') {
    //   this.listToShow = this.list.filter(
    //     x => x.title.rendered.toLowerCase().includes(this.search.toLowerCase())
    //   );
    // } else {
    //   this.listToShow = this.list;
    // }
  }

}
