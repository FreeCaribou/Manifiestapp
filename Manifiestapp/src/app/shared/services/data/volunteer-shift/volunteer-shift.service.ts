import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VolunteerShiftService {

  constructor(private httpClient: HttpClient) {
  }

  get(): Observable<any> {
    return this.httpClient.get('', { headers: { Token: '' }})
  }

}