import { Component, ViewChild } from '@angular/core';
import { MapCommunicationService } from 'src/app/shared/services/communication/map.communication.service';
import { Layer, MapOptions } from 'leaflet';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
})
export class MapPage {
  @ViewChild(IonModal) modal: IonModal;

  options: MapOptions;
  markers: Layer[];

  constructor(
    private mapCommunication: MapCommunicationService,
    private loadingCommunication: LoadingCommunicationService,
  ) { }

  ionViewDidEnter() {
    this.loadingCommunication.changeLoaderTo(true);
    this.mapCommunication.getMainMapMarker().subscribe(data => {
      this.options = this.mapCommunication.getOptionsMap();
      this.markers = data;
    }).add(() => { this.loadingCommunication.changeLoaderTo(false) });
  }

  async scanQrCode() {
    console.log('try to scan')
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

}
