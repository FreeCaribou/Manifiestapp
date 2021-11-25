import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InfoListDataService } from './info-list.data.service';
import { IInfoListService } from './info-list.service.interface';

@Injectable({
  providedIn: 'root'
})
export class InfoListService implements IInfoListService {

  constructor(private service: InfoListDataService) { }

  venues: any[];
  getVenues(): Observable<any[]> {
    if (!this.venues) {
      return this.service.getVenues().pipe(
        tap(v => this.venues = v.venues)
      );
    } else {
      return of(this.venues);
    }
  }

  organizers: any[];
  getOrganizers(): Observable<any[]> {
    if (!this.organizers) {
      return this.service.getOrganizers().pipe(
        tap(o => this.organizers = o.organizers)
      );
    } else {
      return of(this.organizers);
    }
  }

  eventCategories: any[];
  getEventCategories(): Observable<any[]> {
    if (!this.eventCategories) {
      return this.service.getVenues().pipe(
        tap(c => this.eventCategories = c.categories)
      );
    } else {
      return of(this.eventCategories);
    }
  }

}