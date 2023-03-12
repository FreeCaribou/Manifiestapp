import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { VivaWalletVerificationCommunicationService } from '../../services/communication/viva-wallet-verification.communication.service';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';

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

  // TODO for IOS
  verifyNfc() {
    this.diagnostic.isNFCEnabled()
      .then(e => { this.vivaWalletVerification.nfcActivated = e; })
      .catch(e => { this.vivaWalletVerification.nfcActivated = false; });
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
    }
    if (this.platform.is('ios')) {
      app = 'viva-wallet://';
    }

    this.appAvailability.check(app)
    .then(
      (yes: boolean) => { this.vivaWalletVerification.vivaWalletInstall = true },
      (no: boolean) => { this.vivaWalletVerification.vivaWalletInstall = false }
    );
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
