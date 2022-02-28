import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingCommunicationService {
  isLoading = [];

  loaderChangeEvent = new EventEmitter<boolean>();

  // We can have multiple call of the loader at the same time, but we want the "false" to be when the array is empty
  changeLoaderTo(value: boolean) {
    value ? this.isLoading.push(true) : this.isLoading.pop();
    this.loaderChangeEvent.emit(value);
  }

}