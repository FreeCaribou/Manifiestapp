import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { LocalStorageEnum } from "src/app/shared/models/LocalStorage.enum";
import { environment } from "src/environments/environment";

// TODO-refactor typing
@Injectable({
  providedIn: 'root'
})
export class VolunteerShiftService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  // TODO-refactor maybe also a mapping of data here ?
  getShifts(): Observable<any[]> {
    if (this.isConnectedToBeeple()) {
      return this.httpClient.get<any[]>(
        `${environment.beepleBridgeUrl}collaborators/${this.getBeepleVolunteerId()}/enrolments`,
        { headers: { Token: this.getBeepleVolunteerToken() } }
      ).pipe(
        map(e => { return this.mapShiftsRemoveOldFromPreviousYear(e); }),
        map(e => { return this.mapSortShiftsByStartDatetime(e); })
      )
    } else {
      return of([])
    }
  }

  login(session): Observable<any> {
    session.display = 'MyManifiesta'
    return this.httpClient.post(`${environment.beepleBridgeUrl}auth`, { session }).pipe(
      tap(data => {
        localStorage.setItem(LocalStorageEnum.BeepleId, data.id);
        localStorage.setItem(LocalStorageEnum.BeepleToken, data.token);
      })
    );
  }

  // no data call method

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

  mapShiftsRemoveOldFromPreviousYear(shifts: any[]): any[] {
    const yearNow = new Date().getFullYear();
    return shifts.filter(s => {
      const yearStart = new Date(s.team.shifts[0]?.start_datetime).getFullYear();
      return yearNow === yearStart;
    });
  }

  mapSortShiftsByStartDatetime(shifts: any[]): any[] {
    return shifts.sort((a, b) => {
      const aDate = new Date(a.team.shifts[0]?.start_datetime).getTime();
      const bDate = new Date(b.team.shifts[0]?.start_datetime).getTime();
      return aDate - bDate;
    });
  }

}