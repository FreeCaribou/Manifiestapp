import { Component } from '@angular/core';
import { MapCommunicationService } from 'src/app/shared/services/communication/map.communication.service';
import { Layer, MapOptions } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
})
export class MapPage {

  options: MapOptions;
  markers: Layer[];

  constructor(private mapCommunication: MapCommunicationService) { }

  ionViewDidEnter() {
    this.options = this.mapCommunication.getOptionsMap();
    this.markers = this.mapCommunication.getMainMapMarker();
  }

}
