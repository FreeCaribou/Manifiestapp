import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class LoaderService {
  loading$: Subject<boolean> = new Subject();
  loaderReference: string[] = [];

  startLoading(reference: string) {
    this.loaderReference.push(reference);
    this.changeLoadingState();
  }

  stopLoading(reference: string) {
    const index = this.loaderReference.findIndex(r => r === reference);
    if (index > -1) {
      this.loaderReference.splice(index, 1);
    }
    this.changeLoadingState();
  }

  private changeLoadingState() {
    this.loading$.next(this.loaderReference.length > 0);
  }
}