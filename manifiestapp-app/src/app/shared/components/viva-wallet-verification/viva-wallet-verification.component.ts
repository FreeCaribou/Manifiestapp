import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { VivaWalletVerificationCommunicationService } from '../../services/communication/viva-wallet-verification.communication.service';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';
import { LocalStorageEnum } from '../../models/LocalStorage.enum';

@Component({
  selector: 'app-viva-wallet-verification',
  templateUrl: './viva-wallet-verification.component.html',
})
export class VivaWalletVerificationComponent implements AfterViewInit, OnInit {

  constructor(
    public vivaWalletVerification: VivaWalletVerificationCommunicationService,
    private diagnostic: Diagnostic,
    private platform: Platform,
    private appAvailability: AppAvailability,
    private openSetting: OpenNativeSettings,
  ) {
  }

  ngOnInit(): void {
    this.verifyHardwareForVivaWallet();
  }

  ionViewWillEnter() {
    this.verifyHardwareForVivaWallet();
  }

  ngAfterViewInit(): void {
    document.addEventListener('visibilitychange', () => {
      this.verifyHardwareForVivaWallet();
    });
  }

  get knowNfcNotThere() {
    return localStorage.getItem(LocalStorageEnum.KnowNotNFC);
  }

  // TODO for IOS
  verifyNfc() {
    // If NFC is on the phone, we check if enabled or not
    // If not present, we act like it is to not block everything because Viva Wallet can manage that too

    this.diagnostic.isNFCPresent()
      .then((r) => {
        this.vivaWalletVerification.nfcAvailable = r;
        if (r === true) {
          this.diagnostic.isNFCEnabled()
          .then(r => { this.vivaWalletVerification.nfcActivated = r; })
          .catch(e => { this.vivaWalletVerification.nfcActivated = false; });
        }
      })
      .catch((e) => {
        this.vivaWalletVerification.nfcAvailable = false;
      });


    // this.diagnostic.isNFCPresent().then(r => {
    //   this.vivaWalletVerification.nfcAvailable = r;
    //   if (r) {
    //     this.diagnostic.isNFCEnabled()
    //       .then(e => { this.vivaWalletVerification.nfcActivated = true; })
    //       .catch(e => { this.vivaWalletVerification.nfcActivated = false;& });
    //   } else {
    //     this.vivaWalletVerification.nfcActivated = true;
    //   }
    // });


    // if (this.diagnostic.NFCState) {
    //   this.vivaWalletVerification.nfcAvailable = true;
    //   this.diagnostic.isNFCPresent().then(r => {
    //     this.diagnostic.isNFCEnabled()
    //       .then(e => { this.vivaWalletVerification.nfcActivated = e; })
    //       .catch(e => { this.vivaWalletVerification.nfcActivated = false; });
    //   }).then(err => { this.vivaWalletVerification.nfcActivated = true; })
    // } else {
    //   this.vivaWalletVerification.nfcActivated = true;
    //   this.vivaWalletVerification.nfcAvailable = false;
    // }
  }

  // TODO for IOS
  verifyGps() {
    this.diagnostic.isGpsLocationEnabled()
      .then(e => { this.vivaWalletVerification.gpsActivated = e; })
      .catch(e => { this.vivaWalletVerification.gpsActivated = false; });
  }

  verifyVivaWallet() {
    let app = '';
    if (this.platform.is('android')) {
      app = 'com.vivawallet.spoc.payapp';

      this.appAvailability.check(app)
        .then(
          (yes: boolean) => { this.vivaWalletVerification.vivaWalletInstall = true },
          (no: boolean) => { this.vivaWalletVerification.vivaWalletInstall = false }
        );
    }
    if (this.platform.is('ios')) {
      app = 'viva-wallet://';
      this.vivaWalletVerification.vivaWalletInstall = true;
    }
  }

  goInstallVivaWallet() {
    if (this.platform.is('android')) {
      window.open(
        'market://details?id=com.vivawallet.spoc.payapp', '_system'
      );
    }

    if (this.platform.is('ios')) {
      window.open(
        'itms-apps://itunes.apple.com/be/app/viva-wallet/id1510538423?mt=8', '_system'
      );
    }
  }

  goActiveGps() {
    if (this.platform.is('android')) {
      this.diagnostic.switchToLocationSettings();
    }
    if (this.platform.is('ios')) {
      this.openSetting.open('locations');
    }
  }

  goActiveNfc() {
    if (this.platform.is('android')) {
      this.diagnostic.switchToNFCSettings();
    }
    if (this.platform.is('ios')) {
      this.openSetting.open('settings');
    }
  }

  nfcNotAvailableOk() {
    localStorage.setItem(LocalStorageEnum.KnowNotNFC, 'true');
  }

  verifyHardwareForVivaWallet() {
    this.verifyVivaWallet();
    this.verifyGps();
    this.verifyNfc();

    this.diagnostic.registerNFCStateChangeHandler(() => {
      this.verifyNfc();
    });

    this.diagnostic.registerLocationStateChangeHandler(() => {
      this.verifyGps();
    });
  }

}
