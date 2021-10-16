import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';
import { LocalStorageEnum } from 'src/app/shared/models/LocalStorage.enum';
import { ProgrammeDataService } from './programme.data.service';
import { IProgrammeService } from './programme.service.interface';

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

  getProgrammeOfTheDay(day: EventDayEnum): Observable<EventInterface[]> {
    return this.service.getProgrammeOfTheDay(day).pipe(
      map(e => this.mapToFavorite(e))
    );
  }

  getFavoriteProgramme(): Observable<EventInterface[]> {
    return this.service.getFavoriteProgramme().pipe(
      map(e => this.filterFavorite(e)),
      map(e => this.mapToFavorite(e))
    )
  }

  // no data call method

  getFavoriteId(): string[] {
    return localStorage.getItem(LocalStorageEnum.FavoriteId)?.split(',');
  }

  changeFavorite(event: EventInterface) {
    const isChangedToFavorite = event.favorite = !event.favorite;
    const favoriteId: string[] = this.getFavoriteId();

    if (isChangedToFavorite && !favoriteId) {
      localStorage.setItem(LocalStorageEnum.FavoriteId, [event.id].toString())
    } else if (isChangedToFavorite && favoriteId) {
      localStorage.setItem(LocalStorageEnum.FavoriteId, [...favoriteId, event.id].toString())
    } else if (!isChangedToFavorite && favoriteId) {
      const favoriteIdFiltered = favoriteId.filter(x => x !== event.id);
      if (favoriteIdFiltered.length > 0) {
        localStorage.setItem(LocalStorageEnum.FavoriteId, favoriteId.filter(x => x !== event.id).toString())
      } else {
        localStorage.removeItem(LocalStorageEnum.FavoriteId);
      }
    }

    this.favoriteChangeEmit.emit(event);
  }

  isFavorite(id: string): boolean {
    return this.getFavoriteId()?.includes(id);
  }

  mapToFavorite(events: EventInterface[]): EventInterface[] {
    events.map(
      x => x.favorite = this.isFavorite(x.id)
    );
    return events;
  }

  filterFavorite(events: EventInterface[]): EventInterface[] {
    return events.filter(x => this.isFavorite(x.id));
  }

}