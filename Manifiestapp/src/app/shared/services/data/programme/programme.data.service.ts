import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';
import { environment } from 'src/environments/environment';
import { LanguageCommunicationService } from '../../communication/language.communication.service';
import { IProgrammeService } from './programme.service.interface';

@Injectable({
  providedIn: 'root'
})
export class ProgrammeDataService implements IProgrammeService {

  baseUrl = `${environment.baseUrl}evenement`;
  embed = 'wp:attachment,wp:term,wp:featuredmedia';

  constructor(
    private httpClient: HttpClient,
    private languageService: LanguageCommunicationService,
  ) { }

  getAllProgramme(): Observable<EventInterface[]> {
    return this.httpClient.get<EventInterface[]>(`${this.baseUrl}`);
  }

  getAllProgrammeFilter(day?: string[], locatiesId?: string[], categoriesId?: string[], organizersId?: string[]): Observable<EventInterface[]> {
    let params = new HttpParams();

    params = params.append('_embed', this.embed);

    if (day?.length > 0) {
      params = params.append('dag', day.toString());
    }
    if (locatiesId?.length > 0) {
      params = params.append('locatie', locatiesId.toString());
    }
    if (organizersId?.length > 0) {
      params = params.append('organizer', organizersId.toString());
    }
    if (categoriesId?.length > 0) {
      params = params.append('categories', categoriesId.toString());
    }

    return this.httpClient.get<EventInterface[]>(`${this.baseUrl}?${params.toString()}&lang=${this.languageService.selectedLanguage}`);
  }

  getFavoriteProgramme(ids?: string[]): Observable<EventInterface[]> {
    return this.httpClient.get<EventInterface[]>(`${this.baseUrl}?include=${ids?.toString()}&_embed=${this.embed}&lang=${this.languageService.selectedLanguage}`);
  }

  getEvent(id: string): Observable<EventInterface> {
    return this.httpClient.get<EventInterface>(`${this.baseUrl}/${id}?_embed=${this.embed}&lang=${this.languageService.selectedLanguage}`);
  }

}