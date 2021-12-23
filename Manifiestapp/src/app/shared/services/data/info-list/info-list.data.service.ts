import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LanguageCommunicationService } from '../../communication/language.communication.service';
import { IInfoListService } from './info-list.service.interface';

@Injectable({
  providedIn: 'root'
})
export class InfoListDataService implements IInfoListService {

  baseUrl = environment.baseUrl;

  constructor(
    private httpClient: HttpClient,
    private languageService: LanguageCommunicationService,
  ) { }

  getVenues(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}locatie?lang=${this.languageService.selectedLanguage}`);
  }

  getOrganizers(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}organizers?lang=${this.languageService.selectedLanguage}`);
  }

  getEventCategories(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}categories?lang=${this.languageService.selectedLanguage}`);
  }

  getDays(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}dag?lang=${this.languageService.selectedLanguage}`);
  }

}