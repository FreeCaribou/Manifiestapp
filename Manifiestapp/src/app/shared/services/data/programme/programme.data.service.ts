import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';
import { environment } from 'src/environments/environment';
import { LanguageCommunicationService } from '../../communication/language.communication.service';
import { BaseService } from '../base.service';
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
    private baseService: BaseService,
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
      params = params.append('programmacategorie', categoriesId.toString());
    }

    return this.fetchWordPressListPage(`${this.baseUrl}?${params.toString()}&lang=${this.languageService.selectedLanguage}`, 1, []);
    return this.baseService.get(`${this.baseUrl}?${params.toString()}&lang=${this.languageService.selectedLanguage}&per_page=2`);
    return this.httpClient.get<EventInterface[]>(`${this.baseUrl}?${params.toString()}&lang=${this.languageService.selectedLanguage}&per_page=100`);
  }

  getFavoriteProgramme(ids?: string[]): Observable<EventInterface[]> {
    return this.fetchWordPressListPage(`${this.baseUrl}?include=${ids?.toString()}&_embed=${this.embed}&lang=${this.languageService.selectedLanguage}`, 1, []);
    return this.baseService.get(`${this.baseUrl}?include=${ids?.toString()}&_embed=${this.embed}&lang=${this.languageService.selectedLanguage}&per_page=100`);
    return this.httpClient.get<EventInterface[]>(`${this.baseUrl}?include=${ids?.toString()}&_embed=${this.embed}&lang=${this.languageService.selectedLanguage}&per_page=100`);
  }

  getEvent(id: string): Observable<EventInterface> {
    return this.baseService.get(`${this.baseUrl}/${id}?_embed=${this.embed}&lang=${this.languageService.selectedLanguage}`);
    return this.httpClient.get<EventInterface>(`${this.baseUrl}/${id}?_embed=${this.embed}&lang=${this.languageService.selectedLanguage}`);
  }

  // WordPress can return max 100 items per call
  // More and we have a fail result
  // But we have the attributes page to parcours the page
  // Here we parcours in a recursive method the page
  // If the result is not an array, is that we are at the end and we return the lastArray
  // If the length of the result is lesser than the maxPerPage, is that we are also at the end so we return a merge of the lastArray and the respons
  fetchWordPressListPage(url, count = 1, lastArray: EventInterface[] = [], maxPerPage = 2): Observable<EventInterface[]> {
    let arrayToReturn: EventInterface[] = lastArray;
    return this.baseService.get(`${url}&page=${count}`).pipe(
      switchMap(e => {
        if (!Array.isArray(e)) {
          return of(lastArray);
        }
        arrayToReturn = arrayToReturn.concat(e);
        if (e.length === maxPerPage) {
          return this.fetchWordPressListPage(url, count + 1, arrayToReturn);
        } else {
          return of(arrayToReturn);
        }
      })
    );
  }

}