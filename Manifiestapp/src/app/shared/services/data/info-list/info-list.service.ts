import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LocalStorageEnum } from 'src/app/shared/models/LocalStorage.enum';
import { LanguageCommunicationService } from '../../communication/language.communication.service';
import { InfoListDataService } from './info-list.data.service';
import { IInfoListService } from './info-list.service.interface';

@Injectable({
  providedIn: 'root'
})
export class InfoListService implements IInfoListService {

  constructor(
    private service: InfoListDataService,
    private languageService: LanguageCommunicationService
  ) {
    this.languageService.langHasChangeEvent.subscribe(e => {
      this.resetInfoListCache();
    })
  }

  venues: any[];
  getVenues(): Observable<any[]> {
    if (!this.venues || this.venues.length === 0) {
      return this.service.getVenues().pipe(
        tap(v => this.venues = v),
      );
    } else {
      return of(this.venues);
    }
  }

  organizers: any[];
  getOrganizers(): Observable<any[]> {
    if (!this.organizers || this.organizers.length === 0) {
      return this.service.getOrganizers().pipe(
        tap(o => this.organizers = o),
      );
    } else {
      return of(this.organizers);
    }
  }

  eventCategories: any[];
  getEventCategories(): Observable<any[]> {
    if (!this.eventCategories || this.eventCategories.length === 0) {
      return this.service.getEventCategories().pipe(
        tap(c => this.eventCategories = c),
      );
    } else {
      return of(this.eventCategories);
    }
  }

  days: any[];
  getDays(): Observable<any[]> {
    if (!this.days || this.days.length === 0) {
      return this.service.getDays().pipe(
        tap(d => this.days = d),
        tap(d => localStorage.setItem(LocalStorageEnum.OfflineDays, JSON.stringify(d))),
      );
    } else {
      return of(this.days)
    }
  }

  getScheduleUpdate(): Observable<any[]> {
    return this.service.getScheduleUpdate();
  }

  resetInfoListCache() {
    this.venues = [];
    this.organizers = [];
    this.eventCategories = [];
    this.days = [];
  }


  // offline

  getOfflineDaysList(): any[] {
    const tmp = localStorage.getItem(LocalStorageEnum.OfflineDays);
    if (tmp) {
      try {
        return JSON.parse(localStorage.getItem(LocalStorageEnum.OfflineDays));
      } catch (e) {
        return [];
      }
    } else {
      return [];
    }
  }

}