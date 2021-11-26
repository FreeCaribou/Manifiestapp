import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IInfoListService } from './info-list.service.interface';

@Injectable({
  providedIn: 'root'
})
export class InfoListDataService implements IInfoListService {

  baseUrl = 'https://testwordpress.gerardweb.eu/wp-json/tribe/events/v1/';

  constructor(private httpClient: HttpClient) { }

  getVenues(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}venues`);
  }
  getOrganizers(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}organizers`);
  }
  getEventCategories(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}categories`);
  }

}