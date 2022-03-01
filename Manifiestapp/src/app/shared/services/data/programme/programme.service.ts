import { EventEmitter, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { LocalStorageEnum } from 'src/app/shared/models/LocalStorage.enum';
import { ProgrammeDataService } from './programme.data.service';
import { IProgrammeService } from './programme.service.interface';

import { LocalNotifications, PendingLocalNotificationSchema } from '@capacitor/local-notifications';
import { NotificationEventEnum } from 'src/app/shared/models/NotificationEvent.enum';
import { wpDateToRealDate } from 'src/app/shared/utils/wp-date-to-real-date';
import * as moment from 'moment';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ProgrammeService implements IProgrammeService {

  favoriteChangeEmit = new EventEmitter<EventInterface>();
  verificationFavoriteLoadEmit = new EventEmitter<boolean>();

  constructor(
    private service: ProgrammeDataService,
    private toastController: ToastController,
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
    return this.getFavoriteId().length > 0 ?
      this.service.getFavoriteProgramme(this.getFavoriteId()).pipe(
        map(e => this.mapArrayRawWpDataToClearData(e)),
        map(e => this.mapToFavorite(e)),
        map(e => this.mapVerifyFavoriteConflict(e)),
        map(e => this.mapOrderByStartDate(e)),
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

  async verifyEventHourConflictForNewFav(event: EventInterface) {
    this.verificationFavoriteLoadEmit.emit(true);
    const favs = await this.getFavoriteProgramme().toPromise();
    if (favs.length > 1) {
      const conflicts = favs.filter(e => {
        return e.id !== event.id &&
          (moment(event.startDate).isBetween(e.startDate, e.endDate) || moment(event.endDate).isBetween(e.startDate, e.endDate));
      });
      if (conflicts.length > 0) {
        let message = '';
        conflicts.forEach((x, k) => {
          message += `"${x.headline}"${k + 1 === conflicts.length ? '' : ' and '}`;
        });
        const toast = await this.toastController.create({
          header: 'You have conflict with other event in your favoris',
          message,
          icon: 'alert-circle-outline',
          color: 'warning',
          duration: 5000
        });
        toast.present();
      }
    }
    this.verificationFavoriteLoadEmit.emit(false);
  }

  // TODO better notification message and see for the date
  async addOneEventNotif(event: EventInterface) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Event is coming',
          id: parseInt(event.id) || 1,
          body: event?.title?.rendered || 'Check it',
          schedule: { at: new Date(Date.now() + 1000 * 300), allowWhileIdle: true },
          autoCancel: true,
          summaryText: 'One of your favorite event is coming to start',
          actionTypeId: NotificationEventEnum.EventFav
        }
      ]
    });
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

  mapVerifyFavoriteConflict(events: EventInterface[]): EventInterface[] {
    return events.map(e => {
      e.inFavoriteConflict = events.findIndex(i => {
        return i.id !== e.id &&
          (moment(e.startDate).isBetween(i.startDate, i.endDate) || moment(e.endDate).isBetween(i.startDate, i.endDate));
      }) > -1;
      return e;
    })
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
    event.mainPictureUrl = event._embedded?.['wp:featuredmedia'] ? event._embedded?.['wp:featuredmedia'][0]?.source_url : '';
    event.localisation = event._embedded?.['wp:term'] ? event._embedded?.['wp:term'].find(x => x.find(y => y.taxonomy === 'locatie'))[0] : null;
    event.category = event._embedded?.['wp:term'] ? event._embedded?.['wp:term'].find(x => x.find(y => y.taxonomy === 'category'))[0] : null;
    event.day = event._embedded?.['wp:term'] ? event._embedded?.['wp:term'].find(x => x.find(y => y.taxonomy === 'dag'))[0] : null;
    return event;
  }

}