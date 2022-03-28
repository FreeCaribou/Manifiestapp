import { EventEmitter, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators'
import { EventInterface } from 'src/app/shared/models/Event.interface';
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

@Injectable({
  providedIn: 'root'
})
export class ProgrammeService implements IProgrammeService {

  favoriteChangeEmit = new EventEmitter<EventInterface>();
  verificationFavoriteLoadEmit = new EventEmitter<boolean>();

  constructor(
    private service: ProgrammeDataService,
    private volunteerShiftService: VolunteerShiftService,
    private toastController: ToastController,
    private translate: TranslateService
  ) { }

  getAllProgramme(): Observable<EventInterface[]> {
    return this.service.getAllProgramme().pipe(
      map(e => this.mapArrayRawWpDataToClearData(e)),
      map(e => this.mapToFavorite(e)),
      map(e => this.mapOrderByStartDate(e)),
    );
  }

  getAllProgrammeFilter(day: string[], venuesId?: string[], organizersId?: string[], eventCategoriesId?: string[]): Observable<EventInterface[]> {
    return this.service.getAllProgrammeFilter(day, venuesId, organizersId, eventCategoriesId).pipe(
      map(e => this.mapArrayRawWpDataToClearData(e)),
      map(e => this.mapToFavorite(e)),
      map(e => this.mapOrderByStartDate(e)),
    );
  }

  getFavoriteProgramme(ids?: string[]): Observable<EventInterface[]> {
    let shiftsList = [];
    return this.getFavoriteId().length > 0 ?
      this.volunteerShiftService.getShifts().pipe(
        tap(data => { shiftsList = data }),
        switchMap(e => {
          return this.service.getFavoriteProgramme(this.getFavoriteId()).pipe(
            map(e => this.mapArrayRawWpDataToClearData(e)),
            map(e => this.mapToFavorite(e)),
            map(e => this.mapVerifyFavoriteConflict(e, shiftsList)),
            map(e => this.mapOrderByStartDate(e)),
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

  getFavoriteId(): string[] {
    return localStorage.getItem(LocalStorageEnum.FavoriteId)?.split(',') || [];
  }

  async changeFavorite(event: EventInterface) {
    const isChangedToFavorite = event.favorite = !event.favorite;
    const favoriteId: string[] = this.getFavoriteId();

    if (isChangedToFavorite && !favoriteId) {
      localStorage.setItem(LocalStorageEnum.FavoriteId, [event.id.toString()].toString())
    } else if (isChangedToFavorite && favoriteId) {
      localStorage.setItem(LocalStorageEnum.FavoriteId, [...favoriteId, event.id.toString()].toString())
    } else if (!isChangedToFavorite && favoriteId) {
      const favoriteIdFiltered = favoriteId.filter(x => x !== event.id.toString());
      if (favoriteIdFiltered.length > 0) {
        localStorage.setItem(LocalStorageEnum.FavoriteId, favoriteId.filter(x => x !== event.id.toString()).toString())
      } else {
        localStorage.removeItem(LocalStorageEnum.FavoriteId);
      }
    }

    const allNotif = await (await LocalNotifications.getPending()).notifications;
    if (event.favorite) {
      await this.verifyEventHourConflictForNewFav(event);
      if (!allNotif.find(x => x.id == parseInt(event.id))) {
        await this.addOneEventNotif(event);
      }
    } else {
      await this.cancelOneEventNotif(event, allNotif);
    }

    this.favoriteChangeEmit.emit(event);
  }

  // TODO divide the code please ...
  async verifyEventHourConflictForNewFav(event: EventInterface) {
    this.verificationFavoriteLoadEmit.emit(true);
    const favs = await this.getFavoriteProgramme().toPromise();
    if (favs.length > 1) {
      const conflicts = favs.filter(e => {
        return e.id !== event.id && this.verifyConflictBetweenToRangeOfDate(e, event);
      });
      if (conflicts.length > 0) {
        let message = '';
        conflicts.forEach((x, k) => {
          message += `"${x.headline}"${k + 1 === conflicts.length ? '' : ' and '}`;
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

  // TODO better notification message and see for the date
  async addOneEventNotif(event: EventInterface) {
    if (!localStorage.getItem(LocalStorageEnum.AvoidNotification)) {
      const startDateFormated = formatDate(event.startDate, 'HH:mm', 'en', '+00');
      const body = await this.translate.get(
        'Programme.NotificationBody',
        { event: event?.title?.rendered, startDate: startDateFormated })
        .toPromise();
      await LocalNotifications.schedule({
        notifications: [
          {
            title: `${event?.title?.rendered} - ${startDateFormated}` || 'Check it',
            id: parseInt(event.id) || 1,
            body: body,
            largeBody: body,
            // For test, show notification 5 seconds after the click on fav
            schedule: { at: new Date(Date.now() + 1000 * 15), allowWhileIdle: true },
            // For production, an half hour before the event
            // schedule: { at: new Date(new Date(event.startDate).getTime() - 1000 * 60 * 30), allowWhileIdle: true },
            autoCancel: true,
            summaryText: await this.translate.get('Programme.NotificationSummary').toPromise(),
            actionTypeId: NotificationEventEnum.EventFav,
            largeIcon: 'large_icon',
          }
        ]
      });
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

  mapToFavorite(events: EventInterface[]): EventInterface[] {
    events = events.map(x => {
      x.favorite = this.isFavorite(x.id);
      return x;
    });
    return events;
  }

  filterFavorite(events: EventInterface[]): EventInterface[] {
    return events.filter(x => this.isFavorite(x.id));
  }

  // TODO seriously, better code is needed here ...
  mapVerifyFavoriteConflict(events: EventInterface[], shifts = []): EventInterface[] {
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

  // TODO type that
  convertShiftTime(shift): any {
    let shiftDate = shift.team?.shifts[0];
    shiftDate.startDate = shiftDate.start_datetime;
    shiftDate.endDate = shiftDate.end_datetime;
    return shiftDate;
  }

  verifyConflictBetweenToRangeOfDate(a, b): boolean {
    return (
      moment(a.startDate).isBetween(b.startDate, b.endDate, 'minutes', '[]')
      || moment(a.endDate).isBetween(b.startDate, b.endDate, 'minutes', '[]')
      || (moment(a.startDate).isSameOrAfter(b.startDate) && moment(a.endDate).isSameOrBefore(b.endDate))
      || (moment(a.startDate).isSameOrBefore(b.startDate) && moment(a.endDate).isSameOrAfter(b.endDate))
    );
  }

  mapOrderByStartDate(events: EventInterface[]): EventInterface[] {
    return events.sort((a, b) => {
      return a.startDate?.getTime() - b.startDate?.getTime();
    });
  }


  // Mapping the data from WordPress to cleaner data for the app

  mapArrayRawWpDataToClearData(events: EventInterface[]): EventInterface[] {
    return events.map(e => { return this.mapRawWpDataToClearData(e) });
  }

  mapRawWpDataToClearData(event: EventInterface): EventInterface {
    event.startDate = wpDateToRealDate(event['toolset-meta']?.['info-evenement']?.['start-hour']?.raw);
    event.endDate = wpDateToRealDate(event['toolset-meta']?.['info-evenement']?.['end-hour']?.raw);
    event.headline = event.title?.rendered;
    event.mainPictureUrl = event._embedded?.['wp:featuredmedia'] ?
      event._embedded?.['wp:featuredmedia'][0]?.source_url : 'assets/pictures/manifiesta-title-logo.jpg';
    event.localisation = event._embedded?.['wp:term'] ?
      event._embedded?.['wp:term'].find(x => x?.find(y => y.taxonomy === 'locatie'))?.[0] : null;
    event.category = event._embedded?.['wp:term'] ?
      event._embedded?.['wp:term'].find(x => x?.find(y => y.taxonomy === 'programmacategorie'))?.[0] : null;
    event.day = event._embedded?.['wp:term'] ?
      event._embedded?.['wp:term'].find(x => x?.find(y => y?.taxonomy === 'dag'))?.[0] : null;
    return event;
  }

}