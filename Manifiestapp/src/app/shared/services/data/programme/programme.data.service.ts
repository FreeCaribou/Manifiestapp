import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventArrayInterface, EventInterface } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';
import { environment } from 'src/environments/environment';
import { IProgrammeService } from './programme.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ProgrammeDataService implements IProgrammeService {

  baseUrl = `${environment.baseUrl}events`;

  constructor(private httpClient: HttpClient) { }

  getAllProgramme(): Observable<EventArrayInterface> {
    return this.httpClient.get<EventArrayInterface>(`${this.baseUrl}`);
  }

  // TODO see for the date
  getAllProgrammeFilter(day: EventDayEnum, venuesId?: string[], organizersId?: string[], eventCategoriesId?: string[]): Observable<EventArrayInterface> {
    let params = new HttpParams();

    if (venuesId?.length > 0) {
      params = params.append('venue', venuesId.toString());
    }
    if (organizersId?.length > 0) {
      params = params.append('organizer', organizersId.toString());
    }
    if (eventCategoriesId?.length > 0) {
      params = params.append('categories', eventCategoriesId.toString());
    }

    return this.httpClient.get<EventArrayInterface>(`${this.baseUrl}?${params.toString()}`);
  }

  getFavoriteProgramme(ids?: string[]): Observable<EventArrayInterface> {
    return this.httpClient.get<EventArrayInterface>(`${this.baseUrl}?include=${ids?.toString()}`);
  }

  getEvent(id: string): Observable<EventInterface> {
    return this.httpClient.get<EventInterface>(`${this.baseUrl}/${id}`);
  }

}