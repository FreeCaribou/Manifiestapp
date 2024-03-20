import { Component, ViewChild } from '@angular/core';
import { MapCommunicationService } from 'src/app/shared/services/communication/map.communication.service';
import { Layer, MapOptions } from 'leaflet';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { IonModal } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

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

    document.querySelector('body').classList.add('scanner-active');

    console.log('start scannnn 1')
    // Check camera permission
    // This is just a simple example, check out the better checks below
    await BarcodeScanner.checkPermission({force: true});
    console.log('start scannnn 2')

    // make background of WebView transparent
    // note: if you are using ionic this might not be enough, check below
    BarcodeScanner.hideBackground();

    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
    console.log('start scannnn')

    // if the result has content
    if (result.hasContent) {
      console.log(result.content); // log the raw scanned content
    }

  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

}
