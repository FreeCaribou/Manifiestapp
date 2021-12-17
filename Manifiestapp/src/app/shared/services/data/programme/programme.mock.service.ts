import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Observable, of } from 'rxjs';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';
import { MOCK_GET_ALL_PROGRAMME } from './programme.mock';
import { IProgrammeService } from './programme.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ProgrammeMockService implements IProgrammeService {

  getAllProgramme(): Observable<EventInterface[]> {
    return of(cloneDeep(MOCK_GET_ALL_PROGRAMME));
  }

  getAllProgrammeFilter(day: string[], venuesId?: string[], organizersId?: string[], eventCategoriesId?: string[]): Observable<EventInterface[]> {
    return of(cloneDeep(MOCK_GET_ALL_PROGRAMME));
  }

  getFavoriteProgramme(ids?: string[]): Observable<EventInterface[]> {
    return of(cloneDeep(MOCK_GET_ALL_PROGRAMME));
  }

  getEvent(id: string): Observable<EventInterface> {
    return of(cloneDeep(MOCK_GET_ALL_PROGRAMME.find(x => x.id === id)));
  }

}