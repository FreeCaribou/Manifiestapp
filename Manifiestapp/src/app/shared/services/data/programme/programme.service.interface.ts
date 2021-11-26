import { Observable } from 'rxjs';
import { EventArrayInterface, EventInterface } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';

export interface IProgrammeService {
  getAllProgramme(): Observable<EventArrayInterface>;
  getAllProgrammeFilter(day: EventDayEnum, venuesId?: string[], organizersId?: string[], eventCategoriesId?: string[]): Observable<EventArrayInterface>;
  getFavoriteProgramme(ids?: string[]): Observable<EventArrayInterface>;
  getEvent(id: string): Observable<EventInterface>;
}