import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventArrayInterface, EventInterface } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';
import { IProgrammeService } from './programme.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ProgrammeDataService implements IProgrammeService {

  baseUrl = 'http://testwordpress.gerardweb.eu/wp-json/tribe/events/v1/';

  constructor(private httpClient: HttpClient) { }

  getAllProgramme(): Observable<EventArrayInterface> {
    return this.httpClient.get<EventArrayInterface>(`${this.baseUrl}events`);
  }

  // TODO set all the filter needed
  getAllProgrammeFilter(date: string): Observable<EventArrayInterface> {
    return this.httpClient.get<EventArrayInterface>(`${this.baseUrl}events`);
  }

  getFavoriteProgramme(): Observable<EventArrayInterface> {
    return this.httpClient.get<EventArrayInterface>(`${this.baseUrl}events`);
  }

  getEvent(id: string): Observable<EventInterface> {
    throw new Error('Method not implemented.');
  }

}