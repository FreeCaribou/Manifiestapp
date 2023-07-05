import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapOptions, Layer } from 'leaflet';
import { EventInterface, WagtailApiEventItem } from 'src/app/shared/models/Event.interface';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { MapCommunicationService } from 'src/app/shared/services/communication/map.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
})
export class EventDetailPage {
  id: string;
  event: WagtailApiEventItem;
  defaultHref = '/programme';

  options: MapOptions;
  markers: Layer[];

  // for the internet connection
  connected = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private programmeService: ProgrammeService,
    private mapCommunication: MapCommunicationService,
    public loadingCommunication: LoadingCommunicationService,
  ) { }

  ionViewDidEnter() {
    this.loadingCommunication.changeLoaderTo(true);
    this.id = this.activatedRoute.snapshot.params.id;
    this.programmeService.getBigBlobAllProgramme().subscribe(data => {
      this.event = data.items.find(i => i.id.toString() == this.id);
    }).add(() => this.loadingCommunication.changeLoaderTo(false));

    // Network.getStatus().then(n => {
    //   this.connected = n.connected;
    //   if (this.connected) {
    //     this.loadingCommunication.changeLoaderTo(true);
    //     this.id = this.activatedRoute.snapshot.params.id;
    //     this.programmeService.getEvent(this.id).subscribe(data => {
    //       this.event = data;
    
    //       if (this.event.position) {
    //         this.options = this.mapCommunication.getOptionsMap(
    //           this.event.position.lat,
    //           this.event.position.lng
    //         );
    //         this.markers = [
    //           this.mapCommunication.createMarker(
    //             this.event.position.lat,
    //             this.event.position.lng,
    //             `${this.event.title} - ${this.event.description}`,
    //             this.event.id)
    //         ];
    //       }
    //     }).add(() => { this.loadingCommunication.changeLoaderTo(false); });
    
    //     this.programmeService.verificationFavoriteLoadEmit.subscribe(load => this.loadingCommunication.changeLoaderTo(load));
    //   }
    // });
  }

  onCardHeartClick(event: WagtailApiEventItem) {
    this.programmeService.changeFavorite(event);
  }

}
