import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { LocalStorageEnum } from "src/app/shared/models/LocalStorage.enum";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class VolunteerShiftService {

  constructor(
    private httpClient: HttpClient,
  ) {}

  getShifts(): Observable<any> {
    if (this.isConnectedToBeeple()) {
      return this.httpClient.get(
        `${environment.beepleBridgeUrl}collaborators/${this.getBeepleVolunteerId()}/enrolments`,
        { headers: { Token: this.getBeepleVolunteerToken() } }
      )
    } else {
      return of([])
    }

  }

  login(session): Observable<any> {
    session.display = 'ManifiestApp'
    return this.httpClient.post(`${environment.beepleBridgeUrl}auth`, { session }).pipe(
      tap(data => {
        localStorage.setItem(LocalStorageEnum.BeepleId, data.id);
        localStorage.setItem(LocalStorageEnum.BeepleToken, data.token);
      })
    );
  }

  logout() {
    localStorage.removeItem(LocalStorageEnum.BeepleId);
    localStorage.removeItem(LocalStorageEnum.BeepleToken);
  }

  getBeepleVolunteerId(): string {
    return localStorage.getItem(LocalStorageEnum.BeepleId);
  }

  getBeepleVolunteerToken(): string {
    return localStorage.getItem(LocalStorageEnum.BeepleToken);
  }

  isConnectedToBeeple(): boolean {
    return (this.getBeepleVolunteerId() && this.getBeepleVolunteerToken()) as unknown as boolean;
  }

}