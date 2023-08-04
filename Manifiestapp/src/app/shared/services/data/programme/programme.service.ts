import { EventEmitter, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators'
import { DayListEventInterface, EventInterface, WagtailApiEventItem, WagtailApiEventItemDaysList, WagtailApiReturn } from 'src/app/shared/models/Event.interface';
import { LocalStorageEnum } from 'src/app/shared/models/LocalStorage.enum';
import { ProgrammeDataService } from './programme.data.service';
import { IProgrammeService } from './programme.service.interface';

import { LocalNotifications, PendingLocalNotificationSchema } from '@capacitor/local-notifications';
import { NotificationEventEnum } from 'src/app/shared/models/NotificationEvent.enum';
import { wpDateToRealDate } from 'src/app/shared/utils/wp-date-to-real-date';
import * as moment from 'moment';
import { ToastController } from '@ionic/angular';
import { VolunteerShiftService } from '../volunteer-shift/volunteer-shift.service';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from '@angular/common';
import { LanguageCommunicationService } from '../../communication/language.communication.service';
import { environment } from '../../../../../environments/environment';
import { BaseService } from '../base.service';

// TODO clean old code from wordpress
@Injectable({
  providedIn: 'root'
})
export class ProgrammeService {

  favoriteChangeEmit = new EventEmitter<WagtailApiEventItem>();
  verificationFavoriteLoadEmit = new EventEmitter<boolean>();

  cacheBigBlobProgrammeBrut: WagtailApiReturn;
  cacheBigBlobProgramme: WagtailApiEventItem[] = [];
  cacheBigBlobProgrammeChangeEmit$ = new EventEmitter<void>();

  constructor(
    private service: ProgrammeDataService,
    private volunteerShiftService: VolunteerShiftService,
    private toastController: ToastController,
    private translate: TranslateService,
    private languageService: LanguageCommunicationService,
    private baseService: BaseService,
  ) {
    this.languageService.langHasChangeEvent.subscribe(e => {
      this.resetListCache();
    });

    localStorage.removeItem(LocalStorageEnum.FavoriteId);
  }

  retrieveProgrammeInLoop(url, count = 0, lastArray: EventInterface[] = [], maxPerPage = 50): Observable<any> {
    let arrayToReturn: EventInterface[] = lastArray;
    return this.baseService.getCall(`${url}&offset=${maxPerPage * count}&limit=${maxPerPage}`).pipe(
      switchMap(e => {
        if (!Array.isArray(e.items)) {
          return of(lastArray);
        }
        arrayToReturn = arrayToReturn.concat(e.items);
        if (e.items.length === maxPerPage) {
          return this.retrieveProgrammeInLoop(url, count + 1, arrayToReturn);
        } else {
          return of(arrayToReturn);
        }
      })
    );
  }

  getBigBlobAllProgramme(): Observable<WagtailApiReturn> {
    if (this.cacheBigBlobProgramme.length > 0) {
      return of(this.cacheBigBlobProgrammeBrut);
    }
    let url = 'https://manifiesta.be/api/v2/pages/?type=event.EventPage';
    url += '&fields=description,api_event_dates,api_location,image,api_categories';
    url += '&locale=' + this.languageService.selectedLanguage;
    url += '&format=json';
    return this.retrieveProgrammeInLoop(url).pipe(
      // Map and sort the date and hours
      map(datas => {
        try {
          datas = datas.map(i => {
            let dayInString = '';
            switch (i.api_event_dates[0].day) {
              case 'SAT':
                dayInString = '2023-09-09T';
                break;
              case 'SUN':
                dayInString = '2023-09-10T';
                break;
            }
            return {
              ...i,
              api_event_dates: [
                {
                  day: i.api_event_dates[0].day,
                  start: dayInString + i.api_event_dates[0].start,
                  end: dayInString + i.api_event_dates[0].end,
                }
              ]
            }
          })
        } catch (e) {
          console.warn('error in mapping date and hour of event', e)
        }
        datas = datas.sort((a, b) => {
          return a.api_event_dates[0].start > b.api_event_dates[0].start;
        });
        return datas;
      }),
      map(e => { return { ...e, items: this.mapToFavorite(e) } }),
      tap(d => this.cacheBigBlobProgramme = d.items),
      tap(d => this.cacheBigBlobProgrammeBrut = d),
      tap(() => this.cacheBigBlobProgrammeChangeEmit$.emit()),
    );
  }

  onlyGetFavoriteProgramme(): Observable<WagtailApiEventItem[]> {
    const ids = this.getFavoriteId();
    if (ids.length > 0) {
      return this.getBigBlobAllProgramme().pipe(
        map(d => { return d.items.filter(i => ids.includes(i.id.toString())) })
      );
    } else {
      return of([]);
    }
  }

  getFavoriteProgramme(ids?: string[]): Observable<WagtailApiEventItem[]> {
    let shiftsList = [];
    return this.getFavoriteId().length > 0 ?
      this.volunteerShiftService.getShifts().pipe(
        tap(data => { shiftsList = data }),
        switchMap(e => {
          return this.onlyGetFavoriteProgramme().pipe(
            map(e => this.mapToFavorite(e)),
            map(e => this.mapVerifyFavoriteConflict(e, shiftsList)),
          )
        })
      )
      : of([]);
  }

  getEvent(id: string): Observable<EventInterface> {
    return this.service.getEvent(id).pipe(
      map(e => this.mapRawWpDataToClearData(e)),
      map(x => {
        x.favorite = this.isFavorite(id);
        return x;
      }),
    );
  }

  // no data call method

  resetListCache() {
    this.cacheBigBlobProgramme = [];
    this.cacheBigBlobProgrammeBrut = null;
  }

  getFavoriteId(): string[] {
    return localStorage.getItem(LocalStorageEnum.FavoriteId2023)?.split(',') || [];
  }

  async changeFavorite(event: WagtailApiEventItem) {
    const isChangedToFavorite = event.favorite = !event.favorite;
    const favoriteId: string[] = this.getFavoriteId();

    if (isChangedToFavorite && !favoriteId) {
      localStorage.setItem(LocalStorageEnum.FavoriteId2023, [event.id.toString()].toString());
    } else if (isChangedToFavorite && favoriteId) {
      localStorage.setItem(LocalStorageEnum.FavoriteId2023, [...favoriteId, event.id.toString()].toString());
    } else if (!isChangedToFavorite && favoriteId) {
      const favoriteIdFiltered = favoriteId.filter(x => x !== event.id.toString());
      if (favoriteIdFiltered.length > 0) {
        localStorage.setItem(LocalStorageEnum.FavoriteId2023, favoriteId.filter(x => x !== event.id.toString()).toString())
      } else {
        localStorage.removeItem(LocalStorageEnum.FavoriteId2023);
      }
    }

    // TODO adapt the notif
    // const allNotif = await (await LocalNotifications.getPending()).notifications;
    // if (event.favorite) {
    //   await this.verifyEventHourConflictForNewFav(event);
    //   if (!allNotif.find(x => x.id == event.id)) {
    //     await this.addOneEventNotif(event);
    //   }
    // } else {
    //   await this.cancelOneEventNotif(event, allNotif);
    // }

    this.favoriteChangeEmit.emit(event);
  }

  async showOkNewFavoriteToast() {
    const toast = await this.toastController.create({
      message: await this.translate.get('Programme.FavAdded').toPromise(),
      icon: 'checkmark-circle-outline',
      color: 'success',
      duration: 1500,
      position: 'top',
    });
    toast.present();
  }

  // TODO-refactor divide the code please ...
  async verifyEventHourConflictForNewFav(event: WagtailApiEventItem) {
    this.verificationFavoriteLoadEmit.emit(true);
    const favs = await this.getFavoriteProgramme().toPromise();
    if (favs.length > 1) {
      const conflicts = favs.filter(e => {
        return e.id !== event.id && this.verifyConflictBetweenToRangeOfDate(e, event);
      });
      if (conflicts.length > 0) {
        let message = '';
        conflicts.forEach((x, k) => {
          message += `"${x.title}"${k + 1 === conflicts.length ? '' : ' and '}`;
        });
        const toast = await this.toastController.create({
          header: await this.translate.get('Programme.HaveConflict').toPromise(),
          message,
          icon: 'alert-circle-outline',
          color: 'warning',
          duration: 5000
        });
        toast.present();
      }

      if (this.volunteerShiftService.getBeepleVolunteerId()) {
        const shifts = await this.volunteerShiftService.getShifts().toPromise();
        const shiftConflict = shifts.filter(s => { return this.verifyConflictBetweenToRangeOfDate(this.convertShiftTime(s), event) });
        if (shiftConflict.length > 0) {
          let message = '';
          shiftConflict.forEach((x, k) => {
            message += `"${x.team?.full_name}"${k + 1 === shiftConflict.length ? '' : ' and '}`;
          });
          const toast = await this.toastController.create({
            header: await this.translate.get('Programme.ConflictShifts').toPromise(),
            message,
            icon: 'alert-circle-outline',
            color: 'warning',
            duration: 5000
          });
          toast.present();
        }
      }
    }
    this.verificationFavoriteLoadEmit.emit(false);
  }

  // TODO beware in production with the date from wp ...
  async addOneEventNotif(event: WagtailApiEventItem) {
    if (!localStorage.getItem(LocalStorageEnum.AvoidNotification) && event.api_event_dates[0].start) {
      const startDateFormated = formatDate(event.api_event_dates[0].start, 'HH:mm', 'fr');
      const body = await this.translate.get(
        'Programme.NotificationBody',
        { event: event?.title, startDate: startDateFormated, location: event?.api_location.name }
      ).toPromise();

      let scheduleDate: Date;
      if (environment.production) {
        // For production, an half hour before the event
        scheduleDate = new Date(new Date(event.api_event_dates[0].start).getTime() - 1000 * 60 * 30);
      } else {
        // For test, show notification 5 seconds after the click on fav
        scheduleDate = new Date(Date.now() + 1000 * 15);
      }

      // We don't need to prepar a notification if the date is in the past !
      if (scheduleDate > new Date()) {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: `${event?.title} - ${startDateFormated}` || 'Check it',
              id: event.id || 1,
              body: body,
              largeBody: body,
              schedule: { at: scheduleDate, allowWhileIdle: true },
              autoCancel: true,
              summaryText: await this.translate.get('Programme.NotificationSummary').toPromise(),
              actionTypeId: NotificationEventEnum.EventFav,
              largeIcon: 'large_icon',
            }
          ]
        });
      }

    }
  }

  async cancelAllEventNotif() {
    const allNotif = await (await LocalNotifications.getPending()).notifications;
    await allNotif.forEach(async n => {
      await LocalNotifications.cancel({ notifications: [n] });
    });
  }

  async addAllNotification() {
    // to be sur to avoid doublon
    await this.cancelAllEventNotif();

    const favorites = await this.getFavoriteProgramme().toPromise();
    await favorites.forEach(async e => {
      await this.addOneEventNotif(e);
    })
  }

  async cancelOneEventNotif(event: EventInterface, notifs: PendingLocalNotificationSchema[]) {
    await notifs.forEach(async n => {
      if (n.id == parseInt(event.id)) {
        await LocalNotifications.cancel({ notifications: [n] });
      }
    });
  }

  isFavorite(id: string): boolean {
    return this.getFavoriteId()?.includes(id.toString());
  }

  mapToFavorite(events: WagtailApiEventItem[]): WagtailApiEventItem[] {
    events = events.map(x => {
      x.favorite = this.isFavorite(x.id.toString());
      return x;
    });
    return events;
  }

  filterFavorite(events: EventInterface[]): EventInterface[] {
    return events.filter(x => this.isFavorite(x.id));
  }

  // TODO-refactor seriously, better code is needed here ...
  mapVerifyFavoriteConflict(events: WagtailApiEventItem[], shifts = []): WagtailApiEventItem[] {
    return events.map(e => {
      e.inFavoriteConflict =
        events.findIndex(i => {
          return i.id !== e.id && this.verifyConflictBetweenToRangeOfDate(e, i);
        }) > -1
        ||
        shifts.findIndex(s => {
          return this.verifyConflictBetweenToRangeOfDate(e, this.convertShiftTime(s));
        }) > -1;
      return e;
    })
  }

  // TODO-refactor type that
  convertShiftTime(shift): any {
    let shiftDate = shift.team?.shifts[0];
    shiftDate.startDate = shiftDate.start_datetime;
    shiftDate.endDate = shiftDate.end_datetime;
    return shiftDate;
  }

  verifyConflictBetweenToRangeOfDate(a, b): boolean {
    try {
      const aStartDate = a.startDate || a.api_event_dates[0].start;
      const aEndDate = a.endDate || a.api_event_dates[0].end;
      const bStartDate = b.startDate || b.api_event_dates[0].start;
      const bEndDate = b.endDate || b.api_event_dates[0].end;
      return (
        moment(aStartDate).isBetween(bStartDate, bEndDate, 'minutes', '()')
        || moment(aEndDate).isBetween(bStartDate, bEndDate, 'minutes', '()')
        || (moment(aStartDate).isAfter(bStartDate) && moment(aEndDate).isBefore(bEndDate))
        || (moment(aStartDate).isBefore(bStartDate) && moment(aEndDate).isAfter(bEndDate))
      );
    } catch (e) { return false; }
  }

  mapOrderByStartDate(events: EventInterface[]): EventInterface[] {
    return events.sort((a, b) => {
      return a.startDate?.getTime() - b.startDate?.getTime();
    });
  }

  mapListEventToDayListEvent(events: WagtailApiEventItem[]): WagtailApiEventItemDaysList[] {
    const dayListEvent = [];
    events.forEach(e => {
      const index = dayListEvent.findIndex(x => e.api_event_dates[0].day === x?.day);
      if (index > -1) {
        dayListEvent[index].events.push(e);
      } else {
        let dayDate: Date;
        switch (e.api_event_dates[0].day) {
          case 'SAT':
            dayDate = new Date('2023-09-09');
            break;
          case 'SUN':
            dayDate = new Date('2023-09-10');
            break;
        }
        dayListEvent.push({
          day: e.api_event_dates[0].day,
          dayDate,
          events: [e]
        });
      }
    });

    return dayListEvent;
  }


  // Mapping the data from WordPress to cleaner data for the app

  mapArrayRawWpDataToClearData(events: EventInterface[]): EventInterface[] {
    return events.map(e => { return this.mapRawWpDataToClearData(e) });
  }

  mapRawWpDataToClearData(event: EventInterface): EventInterface {
    event.startDate = wpDateToRealDate(event['toolset-meta']?.['info-evenement']?.['start-hour']?.formatted, false);
    event.endDate = wpDateToRealDate(event['toolset-meta']?.['info-evenement']?.['end-hour']?.formatted, false);
    event.headline = event.title?.rendered;
    event.mainPictureUrl = event._embedded?.['wp:featuredmedia'] && event._embedded?.['wp:featuredmedia'][0]?.source_url ?
      event._embedded?.['wp:featuredmedia'][0]?.source_url : 'assets/pictures/manifiesta-title-logo.jpg';
    event.localisation = event._embedded?.['wp:term'] ?
      event._embedded?.['wp:term'].find(x => x?.find(y => y.taxonomy === 'locatie'))?.[0] : null;
    event.category = event._embedded?.['wp:term'] ?
      event._embedded?.['wp:term'].find(x => x?.find(y => y.taxonomy === 'programmacategorie'))?.[0] : null;
    event.day = event._embedded?.['wp:term'] ?
      event._embedded?.['wp:term'].find(x => x?.find(y => y?.taxonomy === 'dag'))?.[0] : null;
    return event;
  }


  // offline

  setOfflineFavoritesList(events: DayListEventInterface[]) {
    localStorage.setItem(LocalStorageEnum.OfflineFavorites, JSON.stringify(events));
  }

  getOfflineFavoritesList(): DayListEventInterface[] {
    const tmp = localStorage.getItem(LocalStorageEnum.OfflineFavorites);
    if (tmp) {
      try {
        return JSON.parse(localStorage.getItem(LocalStorageEnum.OfflineFavorites));
      } catch (e) {
        return [];
      }
    } else {
      return [];
    }
  }

  getOfflineProgrammesList(day: string[]): EventInterface[] {
    const tmp = localStorage.getItem(LocalStorageEnum.OfflineProgrammes);
    if (tmp) {
      try {
        const programmesOffline = JSON.parse(localStorage.getItem(LocalStorageEnum.OfflineProgrammes));
        const programmesCache = programmesOffline.find(x => x.days === day.toString());
        return programmesCache?.list || [];
      } catch (e) {
        return [];
      }
    } else {
      return [];
    }
  }

}