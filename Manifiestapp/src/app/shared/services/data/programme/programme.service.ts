import { EventEmitter, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators'
import { DayListEventInterface, EventInterface, IEvent, IEventItemDaysList } from 'src/app/shared/models/Event.interface';
import { LocalStorageEnum } from 'src/app/shared/models/LocalStorage.enum';
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

  favoriteChangeEmit = new EventEmitter<IEvent>();
  verificationFavoriteLoadEmit = new EventEmitter<boolean>();

  cacheBigBlobProgramme: IEvent[] = [];
  cacheBigBlobProgrammeChangeEmit$ = new EventEmitter<void>();

  dataUrl = environment.webDataUrl;

  favoriteIdEnumOfTheYear = LocalStorageEnum.FavoriteId2024;

  constructor(
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

  /**
   * We receive the date of an event in a weird way to build date
   * We have the day (sat or sun, for saturday or sunday) and the second of the event (or the horus but in string)
   * @param day 
   * @param hoursInSecond 
   * @returns Date
   */
  buildOneDateHourFromData(day: 'sat' | 'sun', hoursInSecond: number): Date {
    const saturday = new Date('09/07/2024');
    const sunday = new Date('09/08/2024');
    const hours = Math.floor(hoursInSecond / 3600);
    hoursInSecond -= hours * 3600;
    const minutes = Math.floor(hoursInSecond / 60);
    const baseDate = day === 'sat' ? saturday : sunday;
    baseDate.setHours(hours);
    baseDate.setMinutes(minutes);
    baseDate.setSeconds(0);
    return baseDate;
  }

  // TODO comment all the workflow here
  getEvents(): Observable<IEvent[]> {
    if (this.cacheBigBlobProgramme?.length > 0) {
      return of(this.cacheBigBlobProgramme);
    }
    return this.baseService.bypassCors(`${this.dataUrl}events.${this.languageService.selectedLanguage}.json`).pipe(
      map(data => {
        // An event can have multiple occurences (date - hours)
        // For the listing on the app we need to extract that and duplicate the event by each occurence for the timelines
        const allEventsOccurencesSplitted = [];
        data.forEach(d => {
          d.field_occurrences.forEach(occurrence => {
            occurrence.start = this.buildOneDateHourFromData(occurrence.field_day, occurrence.field_time?.raw?.from);
            occurrence.end = this.buildOneDateHourFromData(occurrence.field_day, occurrence.field_time?.raw?.to);

            allEventsOccurencesSplitted.push({
              ...d,
              picture: d.field_image?.field_media_image?.image_style_uri?.wide,
              thumbnail: d.field_image?.field_media_image?.image_style_uri?.wide_teaser || d.field_image?.field_media_image?.image_style_uri?.wide,
              field_occurrence: occurrence,
              parentId: d.id,
              id: occurrence.id,
            });
          });
        });
        return allEventsOccurencesSplitted;
      }),
      map(items => this.mapToFavorite(items)),
      tap(items => this.cacheBigBlobProgramme = items),
    );
  }

  getEvent(id: string): Observable<IEvent> {
    return this.getEvents().pipe(
      map(list => list.find(e => e.id == id)),
    );
  }

  getEventTypes(): Observable<string[]> {
    return this.getEvents().pipe(
      map(data => {
        return [... new Set(data.map(d => d.field_type.name).sort())];
      }),
    );
  }

  getEventLocalisations(): Observable<string[]> {
    return this.getEvents().pipe(
      map(data => {
        return [... new Set(data.sort((a, b) => {
          if (a.field_occurrence.field_location.path.current === '/location/main-stage') {
            return -1;
          } else if (b.field_occurrence.field_location.path.current === '/location/main-stage') {
            return 1;
          } else {
            return a.name > b.name ? 1 : -1;
          }
        }).map(d => d.field_occurrence.field_location.title))];
      }),
    );
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

  onlyGetFavoriteProgramme(): Observable<IEvent[]> {
    const ids = this.getFavoriteId();
    if (ids.length > 0) {
      return this.getEvents().pipe(
        map(d => { return d.filter(i => ids.includes(i.id.toString())) })
      );
    } else {
      return of([]);
    }
  }

  getFavoriteProgramme(ids?: string[]): Observable<IEvent[]> {
    let shiftsList = [];
    return this.getFavoriteId().length > 0 ?
      this.volunteerShiftService.getShifts().pipe(
        tap(data => {
          shiftsList = data;
        }),
        switchMap(e => {
          return this.onlyGetFavoriteProgramme().pipe(
            map(e => this.mapToFavorite(e)),
            map(e => this.mapVerifyFavoriteConflict(e, shiftsList)),
          )
        }),
      )
      : of([]);
  }

  // no data call method

  resetListCache() {
    this.cacheBigBlobProgramme = [];
  }

  getFavoriteId(): string[] {
    return localStorage.getItem(this.favoriteIdEnumOfTheYear)?.split(',') || [];
  }

  async changeFavorite(event: IEvent) {
    const isChangedToFavorite = event.favorite = !event.favorite;
    const favoriteId: string[] = this.getFavoriteId();

    if (isChangedToFavorite && !favoriteId) {
      localStorage.setItem(this.favoriteIdEnumOfTheYear, [event.id.toString()].toString());
    } else if (isChangedToFavorite && favoriteId) {
      localStorage.setItem(this.favoriteIdEnumOfTheYear, [...favoriteId, event.id.toString()].toString());
    } else if (!isChangedToFavorite && favoriteId) {
      const favoriteIdFiltered = favoriteId.filter(x => x !== event.id.toString());
      if (favoriteIdFiltered.length > 0) {
        localStorage.setItem(this.favoriteIdEnumOfTheYear, favoriteId.filter(x => x !== event.id.toString()).toString())
      } else {
        localStorage.removeItem(this.favoriteIdEnumOfTheYear);
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
  async verifyEventHourConflictForNewFav(event: IEvent) {
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

  async addOneEventNotif(event: IEvent) {
    if (!localStorage.getItem(LocalStorageEnum.AvoidNotification) && event.field_occurrence.start) {
      const startDateFormated = formatDate(event.field_occurrence.start, 'HH:mm', 'fr');
      const body = await this.translate.get(
        'Programme.NotificationBody',
        { event: event?.title, startDate: startDateFormated, location: event?.field_occurrence.field_location.title }
      ).toPromise();

      let scheduleDate: Date;
      if (environment.production) {
        // For production, an half hour before the event
        scheduleDate = new Date(new Date(event.field_occurrence.start).getTime() - 1000 * 60 * 30);
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
              id: parseInt(event.id.split('').filter(x => ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].includes(x)).join('')) || 1,
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

  mapToFavorite(events: IEvent[]): IEvent[] {
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
  mapVerifyFavoriteConflict(events: IEvent[], shifts = []): IEvent[] {
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
      const aStartDate = a.startDate || a.field_occurrence.start;
      const aEndDate = a.endDate || a.field_occurrence.end;
      const bStartDate = b.startDate || b.field_occurrence.start;
      const bEndDate = b.endDate || b.field_occurrence.end;
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

  mapListEventToDayListEvent(events: IEvent[]): IEventItemDaysList[] {
    const dayListEvent = [];
    events.forEach(e => {
      const index = dayListEvent.findIndex(x => e.field_occurrence.field_day === x?.day);
      if (index > -1) {
        dayListEvent[index].events.push(e);
      } else {
        let dayDate: Date;
        switch (e.field_occurrence.field_day) {
          case 'sat':
            dayDate = new Date('2024-09-07');
            break;
          case 'sun':
            dayDate = new Date('2024-09-08');
            break;
        }
        dayListEvent.push({
          day: e.field_occurrence.field_day,
          dayDate,
          events: [e]
        });
      }
    });

    return dayListEvent.sort((a, b) => {
      return a.dayDate.getTime() < b.dayDate.getTime() ? -1 : 1;
    });
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