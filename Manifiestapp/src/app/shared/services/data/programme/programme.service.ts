import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';
import { ProgrammeDataService } from './programme.data.service';
import { IProgrammeService } from './programme.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ProgrammeService implements IProgrammeService {
  constructor(private service: ProgrammeDataService) { }

  getAllProgramme(): Observable<EventInterface[]> {
    return this.service.getAllProgramme();
  }

  getProgrammeOfTheDay(day: EventDayEnum): Observable<EventInterface[]> {
    return this.service.getProgrammeOfTheDay(day);
  }

}