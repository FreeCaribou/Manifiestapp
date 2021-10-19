import { Observable } from 'rxjs';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';

export interface IProgrammeService {
  getAllProgramme(): Observable<EventInterface[]>;
  getProgrammeOfTheDay(day: EventDayEnum): Observable<EventInterface[]>;
  getFavoriteProgramme(): Observable<EventInterface[]>;
  getEvent(id: string): Observable<EventInterface>;
}