import { Observable } from 'rxjs';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';

export interface IProgrammeService {
  getAllProgramme(): Observable<EventInterface[]>;
  getAllProgrammeFilter(day: EventDayEnum, venuesId?: string[], organizersId?: string[], eventCategoriesId?: string[]): Observable<EventInterface[]>;
  getFavoriteProgramme(ids?: string[]): Observable<EventInterface[]>;
  getEvent(id: string): Observable<EventInterface>;
}