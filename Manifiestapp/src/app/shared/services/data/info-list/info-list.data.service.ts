import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LanguageCommunicationService } from '../../communication/language.communication.service';
import { BaseService } from '../base.service';
import { IInfoListService } from './info-list.service.interface';

@Injectable({
  providedIn: 'root'
})
export class InfoListDataService implements IInfoListService {

  baseUrl = environment.baseUrl;

  constructor(
    private httpClient: HttpClient,
    private languageService: LanguageCommunicationService,
    private baseService: BaseService,
  ) { }

  getVenues(): Observable<any[]> {
    return this.baseService.get(`${this.baseUrl}locatie?lang=${this.languageService.selectedLanguage}&per_page=100`);
    return this.httpClient.get<any[]>(`${this.baseUrl}locatie?lang=${this.languageService.selectedLanguage}&per_page=100`);
  }

  getOrganizers(): Observable<any[]> {
    return this.baseService.get(`${this.baseUrl}organizers?lang=${this.languageService.selectedLanguage}&per_page=100`);
    return this.httpClient.get<any[]>(`${this.baseUrl}organizers?lang=${this.languageService.selectedLanguage}&per_page=100`);
  }

  getEventCategories(): Observable<any[]> {
    return this.baseService.get(`${this.baseUrl}programmacategorie?lang=${this.languageService.selectedLanguage}&per_page=100`);
    return this.httpClient.get<any[]>(`${this.baseUrl}programmacategorie?lang=${this.languageService.selectedLanguage}&per_page=100`);
  }

  getDays(): Observable<any[]> {
    return this.baseService.get(`${this.baseUrl}dag?lang=${this.languageService.selectedLanguage}&per_page=100`);
    return this.httpClient.get<any[]>(`${this.baseUrl}dag?lang=${this.languageService.selectedLanguage}&per_page=100`);
  }

}