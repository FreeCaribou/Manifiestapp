import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Observable, forkJoin, of } from "rxjs";
import { map, mergeMap, switchMap, tap } from "rxjs/operators";
import { LocalStorageEnum } from "src/app/shared/models/LocalStorage.enum";
import { environment } from "src/environments/environment";
import { BaseService } from "../base.service";
import { LanguageCommunicationService } from "../../communication/language.communication.service";

// TODO-refactor typing
@Injectable({
  providedIn: 'root'
})
export class VolunteerShiftService {

  baseUrl = `${environment.apiUrl}`;

  sellerAccessDataChangeEmit = new EventEmitter<string>();

  constructor(
    private httpClient: HttpClient,
    private baseService: BaseService,
    private languageService: LanguageCommunicationService,
  ) { }

  // TODO-refactor maybe also a mapping of data here ?
  shifts: any[];
  getShifts(): Observable<any> {
    if (this.isConnectedToBeeple()) {
      if (!this.shifts || this.shifts.length === 0) {
        let tmpShift = [];
        return this.httpClient.get<any>(
          `${this.baseUrl}sellers/user-shifts/${this.getBeepleVolunteerId()}`,
        ).pipe(
          map(shift => shift.enrolments),
          map(e => { return this.mapShiftsRemoveOldFromPreviousYear(e); }),
          map(e => { return this.mapSortShiftsByStartDatetime(e); }),
          tap(d => { tmpShift = d }),
          switchMap(d => {
            return forkJoin(d.map(i => this.getOneShift(i.id)))
          }),
          map(d => {
            for (let i = 0; i < d.length; i++) {
              tmpShift[i]['team'] = d[i].team;
            }
            return tmpShift;
          }),
          tap(s => this.shifts = tmpShift),
          tap(s => this.setOfflineList(s)),
        )
      } else {
        return of(this.shifts);
      }

    } else {
      return of([])
    }
  }

  getOneShift(id): Observable<any> {
    return this.httpClient.get<any>(
      `${this.baseUrl}sellers/shift/${id}`,
    )
  }

  login(session): Observable<any> {
    session.display = 'MyManifiesta'
    return this.baseService.postCall(`${this.baseUrl}sellers/connect`, session).pipe(
      tap(data => {
        localStorage.setItem(LocalStorageEnum.BeepleId, data.id);
        localStorage.setItem(LocalStorageEnum.BeepleEmail, data.mail);
        // localStorage.setItem(LocalStorageEnum.BeepleToken, data.token);
      })
    );
  }

  // no data call method

  logout() {
    this.shifts = [];
    localStorage.removeItem(LocalStorageEnum.BeepleId);
    localStorage.removeItem(LocalStorageEnum.BeepleToken);
  }

  getBeepleVolunteerId(): string {
    return localStorage.getItem(LocalStorageEnum.BeepleId);
  }

  getBeepleVolunteerToken(): string {
    return localStorage.getItem(LocalStorageEnum.BeepleToken);
  }

  getBeepleVolunteerEmail(): string {
    return localStorage.getItem(LocalStorageEnum.BeepleEmail);
  }

  getSellerDepartment(): string {
    return localStorage.getItem(LocalStorageEnum.SellerDepartment);
  }

  getSellerPostalCode(): string {
    return localStorage.getItem(LocalStorageEnum.SellerPostalCode);
  }

  getSellerSellingGoal(): number {
    return parseInt(localStorage.getItem(LocalStorageEnum.SellerSellingGoal));
  }

  sendSellerVerificationEmit() {
    this.sellerAccessDataChangeEmit.emit('verify');
  }

  isConnectedToBeeple(): boolean {
    return (this.getBeepleVolunteerId() && this.getBeepleVolunteerEmail()) as unknown as boolean;
  }

  // Need to be connected and want to sell and have a departement selected
  isReadyToSellWithData(): boolean {
    return (
      this.getSellerDepartment()
      && this.getSellerPostalCode()
      && this.getSellerSellingGoal()
    ) as unknown as boolean
  }

  mapShiftsRemoveOldFromPreviousYear(shifts: any[]): any[] {
    const yearNow = new Date().getFullYear();
    return shifts.filter(s => {
      const yearStart = new Date(s.worked_hours[0]?.shift.start_datetime).getFullYear();
      return yearNow === yearStart;
    });
  }

  mapSortShiftsByStartDatetime(shifts: any[]): any[] {
    return shifts.sort((a, b) => {
      const aDate = new Date(a.worked_hours[0]?.shift.start_datetime).getTime();
      const bDate = new Date(b.worked_hours[0]?.shift.start_datetime).getTime();
      return aDate - bDate;
    });
  }

  getLongtextVolunteersBenefits(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}admins/longtext/volunteers-benefits/${this.languageService.selectedLanguage}`);
  }

  getLongtextNewInfos(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}admins/longtext/general-new-infos/${this.languageService.selectedLanguage}`);
  }

  getLongtextOveralInfos(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}admins/longtext/over-info/${this.languageService.selectedLanguage}`);
  }

  // offline

  setOfflineList(shifts: any[]) {
    localStorage.setItem(LocalStorageEnum.OfflineShifts, JSON.stringify(shifts));
  }

  getOfflineList(): any[] {
    const tmp = localStorage.getItem(LocalStorageEnum.OfflineShifts);
    if (tmp) {
      try {
        return JSON.parse(localStorage.getItem(LocalStorageEnum.OfflineShifts));
      } catch (e) {
        return [];
      }
    } else {
      return [];
    }
  }

}