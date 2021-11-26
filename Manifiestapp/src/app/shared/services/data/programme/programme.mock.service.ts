import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Observable, of } from 'rxjs';
import { EventArrayInterface, EventInterface } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';
import { MOCK_GET_ALL_PROGRAMME } from './programme.mock';
import { IProgrammeService } from './programme.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ProgrammeMockService implements IProgrammeService {

  getAllProgramme(): Observable<EventArrayInterface> {
    return of(cloneDeep(MOCK_GET_ALL_PROGRAMME));
  }

  getAllProgrammeFilter(day: EventDayEnum, venuesId?: string[], organizersId?: string[], eventCategoriesId?: string[]): Observable<EventArrayInterface> {
    return of(cloneDeep(MOCK_GET_ALL_PROGRAMME));
  }

  getFavoriteProgramme(ids?: string[]): Observable<EventArrayInterface> {
    return of(cloneDeep(MOCK_GET_ALL_PROGRAMME));
  }

  getEvent(id: string): Observable<EventInterface> {
    return of(cloneDeep(MOCK_GET_ALL_PROGRAMME.events.find(x => x.id === id)));
  }

}