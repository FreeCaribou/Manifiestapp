import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IInfoListService } from './info-list.service.interface';

@Injectable({
  providedIn: 'root'
})
export class InfoListDataService implements IInfoListService {

  baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  getVenues(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}locatie`);
  }

  getOrganizers(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}organizers`);
  }

  getEventCategories(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}categories`);
  }

}