import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  baseUrl: string = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
  }

  /**
   * deprecated
   * @param path
   * @returns 
   */
  get(path: string): Observable<any> {
    return this.httpClient.get('https://manifiestback.herokuapp.com/bypasscors', {headers: {url: path}});
  }

  getCall(url: string): Observable<any> {
    return this.httpClient.get(url);
  }

  postCall(url: string, body): Observable<any> {
    return this.httpClient.post(url, body)
  }

}
