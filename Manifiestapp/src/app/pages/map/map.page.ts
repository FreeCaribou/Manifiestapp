import { Component, ViewChild } from '@angular/core';
import { MapCommunicationService } from 'src/app/shared/services/communication/map.communication.service';
import { Layer, MapOptions } from 'leaflet';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { IonModal } from '@ionic/angular';
import {
  BarcodeScanner,
  BarcodeFormat,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning';
import { Router } from '@angular/router';

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
    public router: Router,
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

      // The camera is visible behind the WebView, so that you can customize the UI in the WebView.
  // However, this means that you have to hide all elements that should not be visible.
  // You can find an example in our demo repository.
  // In this case we set a class `barcode-scanner-active`, which then contains certain CSS rules for our app.
  document.querySelector('body')?.classList.add('barcode-scanner-active');

  // Add the `barcodeScanned` listener
  const listener = await BarcodeScanner.addListener(
    'barcodeScanned',
    async result => {
      console.log('We have a scan', result.barcode, result.barcode.rawValue, result.barcode.displayValue)

      try {
        const value = result.barcode.displayValue;
        if (value.includes('https://manifiesta.be/')) {
          // TODO be more careful and make verification
          // Put that in a component just for the qr code, so we put that where ever we want later !
          // Hide that for web versie
          const splitted = value.split('/');
          console.log('we go to ', splitted[splitted.length - 1])
          this.router.navigate(['programme', 'subprogramme', 'localisation'], { queryParams: { place: splitted[splitted.length - 1] } });
        }
      } catch(e) {

      }

      this.stopScan();
    },
  );

  // Start the barcode scanner
  await BarcodeScanner.startScan();
  }

  async stopScan() {
    // Make all elements in the WebView visible again
    document.querySelector('body')?.classList.remove('barcode-scanner-active');
  
    // Remove all listeners
    await BarcodeScanner.removeAllListeners();
  
    // Stop the barcode scanner
    await BarcodeScanner.stopScan();
  };

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

}
