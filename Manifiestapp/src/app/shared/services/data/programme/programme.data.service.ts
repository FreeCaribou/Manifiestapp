import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';
import { environment } from 'src/environments/environment';
import { IProgrammeService } from './programme.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ProgrammeDataService implements IProgrammeService {

  baseUrl = `${environment.baseUrl}evenement`;
  embed = 'wp:attachment,wp:term';

  constructor(private httpClient: HttpClient) { }

  getAllProgramme(): Observable<EventInterface[]> {
    return this.httpClient.get<EventInterface[]>(`${this.baseUrl}`);
  }

  // TODO see for the date
  getAllProgrammeFilter(day: EventDayEnum, locatiesId?: string[], categoriesId?: string[], organizersId?: string[]): Observable<EventInterface[]> {
    let params = new HttpParams();

    params = params.append('_embed', this.embed);

    if (locatiesId?.length > 0) {
      params = params.append('locatie', locatiesId.toString());
    }
    if (organizersId?.length > 0) {
      params = params.append('organizer', organizersId.toString());
    }
    if (categoriesId?.length > 0) {
      params = params.append('categories', categoriesId.toString());
    }

    return this.httpClient.get<EventInterface[]>(`${this.baseUrl}?${params.toString()}`);
  }

  getFavoriteProgramme(ids?: string[]): Observable<EventInterface[]> {
    return this.httpClient.get<EventInterface[]>(`${this.baseUrl}?include=${ids?.toString()}&_embed=${this.embed}`);
  }

  getEvent(id: string): Observable<EventInterface> {
    return this.httpClient.get<EventInterface>(`${this.baseUrl}/${id}?_embed=${this.embed}`);
  }

}