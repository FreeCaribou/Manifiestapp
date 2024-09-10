import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LongtextService {

  constructor(private http: HttpClient) { }

  getOneLongtext(label: string, lang: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}admins/longtext/${label}/${lang}`);
  }

  editOneLongText(edit: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}admins/longtext`, edit,
    { headers: { token: localStorage.getItem('admin-token') as string } });
  }

}
