import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';
import { IProgrammeService } from './programme.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ProgrammeDataService implements IProgrammeService {

  constructor(private httpClient: HttpClient) { }

  getAllProgramme(): Observable<EventInterface[]> {
    throw new Error('Method not yet implemented.');
  }

  getProgrammeOfTheDay(day: EventDayEnum): Observable<EventInterface[]> {
    return this.httpClient.get<EventInterface[]>(
      'https://testwordpress.gerardweb.eu/wp-json/wp/v2/posts?_fields=title,content,categories,author,tags,_links,%20_embedded,id&_embed=wp:featuredmedia,wp:term'
    )
  }

  getFavoriteProgramme(): Observable<EventInterface[]> {
    throw new Error('Method not implemented.');
  }

  getEvent(id: string): Observable<EventInterface> {
    throw new Error('Method not implemented.');
  }

}