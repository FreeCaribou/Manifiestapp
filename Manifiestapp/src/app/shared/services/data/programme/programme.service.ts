import { EventEmitter, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { LocalStorageEnum } from 'src/app/shared/models/LocalStorage.enum';
import { ProgrammeDataService } from './programme.data.service';
import { IProgrammeService } from './programme.service.interface';

import { LocalNotifications } from '@capacitor/local-notifications';
import { NotificationEventEnum } from 'src/app/shared/models/NotificationEvent.enum';

@Injectable({
  providedIn: 'root'
})
export class ProgrammeService implements IProgrammeService {

  favoriteChangeEmit = new EventEmitter<EventInterface>();

  constructor(private service: ProgrammeDataService) { }

  getAllProgramme(): Observable<EventInterface[]> {
    return this.service.getAllProgramme().pipe(
      map(e => this.mapToFavorite(e))
    );
  }

  getAllProgrammeFilter(day: string[], venuesId?: string[], organizersId?: string[], eventCategoriesId?: string[]): Observable<EventInterface[]> {
    return this.service.getAllProgrammeFilter(day, venuesId, organizersId, eventCategoriesId).pipe(
      map(e => this.mapToFavorite(e))
    );
  }

  getFavoriteProgramme(ids?: string[]): Observable<EventInterface[]> {
    return this.getFavoriteId() ?
      this.service.getFavoriteProgramme(this.getFavoriteId()).pipe(
        map(e => this.mapToFavorite(e))
      )
      : of([])
  }

  getEvent(id: string): Observable<EventInterface> {
    return this.service.getEvent(id).pipe(
      map(x => {
        x.favorite = this.isFavorite(id);
        return x;
      })
    );
  }

  // no data call method

  getFavoriteId(): string[] {
    return localStorage.getItem(LocalStorageEnum.FavoriteId)?.split(',');
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

    if (event.favorite) {
      // TODO better notification message and see for the date
      const notifs = await LocalNotifications.schedule({
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
      })
    }

    this.favoriteChangeEmit.emit(event);
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

}