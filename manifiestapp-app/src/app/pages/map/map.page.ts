import { Component, ViewChild } from '@angular/core';
import { MapCommunicationService } from 'src/app/shared/services/communication/map.communication.service';
import { Layer, MapOptions } from 'leaflet';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { IonModal, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  BarcodeScanner,
  BarcodeFormat,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';
import { BackButtonCommunicationService } from 'src/app/shared/services/communication/back-buttton.communication.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
})
export class MapPage {
  @ViewChild(IonModal) modal: IonModal;

  options: MapOptions;
  markers: Layer[];

  isAppMode = false;

  constructor(
    private mapCommunication: MapCommunicationService,
    private loadingCommunication: LoadingCommunicationService,
    private programmeService: ProgrammeService,
    public router: Router,
    private backButtonCommunication: BackButtonCommunicationService,
    public platform: Platform,
  ) { }

  ionViewDidEnter() {
    this.loadingCommunication.changeLoaderTo(true);
    this.mapCommunication.getMainMapMarker().subscribe(data => {
      this.options = this.mapCommunication.getOptionsMap();
      this.markers = data;
    }).add(() => { this.loadingCommunication.changeLoaderTo(false) });

    this.backButtonCommunication.goBackPreviousAction.subscribe(() => {
      this.stopScan();
    });
    
    this.isAppMode = this.platform.is('hybrid');
  }

  ionViewWillLeave() {
    this.stopScan();
  }

  async scanQrCode() {
    console.log('begin scanning')
    this.backButtonCommunication.addBlockRef(MapPage.name);

    document.querySelector('body')?.classList.add('barcode-scanner-active');
    const listener = await BarcodeScanner.addListener(
      'barcodeScanned',
      async result => {
        this.backButtonCommunication.removeBlockRef(MapPage.name);
        try {
          // The url from the qr code will look like that - https://manifiesta.be/qr/T00
          // We need to get the last param of the url (T00 here)
          // Get in the asset all the qr code
          // get the right param
          // check if it is an event_location
          // look the id and then retrieve the good localisation
          const value = result.barcode.displayValue;
          const splitted = value.split('/');
          if (value.includes('https://manifiesta.be/qr/')) {
            // TODO be more careful and make verification
            // TODO Put that in a component just for the qr code, so we put that what ever we want later !
            // TODO Hide that for web versie

            const qrCodeCode = splitted[splitted.length - 1];
            this.programmeService.getQrCodeLocalisationTitle(qrCodeCode).subscribe(title => {
              this.router.navigate(['programme', 'subprogramme', 'localisation'], { queryParams: { place: title } });
            });
          }
        } catch (e) {
          this.stopScan();
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

    this.backButtonCommunication.removeBlockRef(MapPage.name);
  };

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

}
