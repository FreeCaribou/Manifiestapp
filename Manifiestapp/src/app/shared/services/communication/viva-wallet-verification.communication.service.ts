import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VivaWalletVerificationCommunicationService {
  vivaWalletInstall = false;
  gpsActivated = false;
  nfcActivated = false;
}