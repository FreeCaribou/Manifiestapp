import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';
import { IProgrammeService } from './programme.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ProgrammeDataService implements IProgrammeService {

  getAllProgramme(): Observable<EventInterface[]> {
    throw new Error('Method not yet implemented.');
  }

  getProgrammeOfTheDay(day: EventDayEnum): Observable<EventInterface[]> {
    throw new Error('Method not implemented.');
  }

}