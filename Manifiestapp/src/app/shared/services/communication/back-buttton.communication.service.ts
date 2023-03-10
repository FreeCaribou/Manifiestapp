import { EventEmitter, Injectable } from '@angular/core';

// Sometime we want to block de back button because "voila"
@Injectable({
  providedIn: 'root'
})
export class BackButtonCommunicationService {
  readonly blockReference: string[] = [];

  readonly goBackSellingPage = new EventEmitter<void>();

  addBlockRef(ref: string) {
    this.blockReference.push(ref);
  }

  removeBlockRef(ref: string) {
    const index = this.blockReference.findIndex(i => i === ref);
    if (index > -1) {
      this.blockReference.splice(index, 1);
    }
  }

  sendGoBackToSellingPage() {
    this.goBackSellingPage.emit();
  }
}