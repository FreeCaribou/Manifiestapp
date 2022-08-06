import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EventInterface } from 'src/app/shared/models/Event.interface';
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
  list: EventInterface[];
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private programmeService: ProgrammeService,
    private infoListService: InfoListService,
    public loadingCommunication: LoadingCommunicationService
  ) { }

  ionViewWillEnter() {
    this.dayId = this.activatedRoute.snapshot.params.dayId;

    Network.getStatus().then(n => {
      this.connected = n.connected;
      if (this.connected) {
        this.loadingCommunication.changeLoaderTo(true);
        forkJoin([
          this.programmeService.getAllProgrammeFilter([this.dayId]),
          this.infoListService.getVenues(),
          this.infoListService.getEventCategories(),
          // this.infoListService.getOrganizers(),
        ]).subscribe(datas => {
          this.list = datas[0];
          this.locaties = datas[1];
          this.categories = datas[2];
          // this.organizers = datas[3];
        }).add(() => { this.loadingCommunication.changeLoaderTo(false); });
    
        this.programmeService.verificationFavoriteLoadEmit.subscribe(load => this.loadingCommunication.changeLoaderTo(load));
      } else {
        this.list = this.programmeService.getOfflineProgrammesList([this.dayId]);
      }
    });
  }

  onSelectChange() {
    this.loadingCommunication.changeLoaderTo(true);
    this.programmeService.getAllProgrammeFilter(
      [this.dayId],
      this.locatieSelected ? [this.locatieSelected] : null,
      this.categorieSelected ? [this.categorieSelected] : null,
      // this.organizerSelected ? [this.organizerSelected] : null,
    ).subscribe(data => {
      this.list = data;
    }).add(() => { this.loadingCommunication.changeLoaderTo(false); });
  }

  ionViewWillLeave() {
    this.list = [];
  }

}
