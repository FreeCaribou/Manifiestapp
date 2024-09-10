import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IInfoListService } from './info-list.service.interface';

@Injectable({
  providedIn: 'root'
})
export class InfoListMockService implements IInfoListService {

  getVenues(): Observable<any[]> {
    return of([]);
  }
  getOrganizers(): Observable<any[]> {
    return of([]);
  }
  getEventCategories(): Observable<any[]> {
    return of([]);
  }

  getDays(): Observable<any[]> {
    return of([]);
  }

  getScheduleUpdate(): Observable<any[]> {
    return of([]);
  }

}