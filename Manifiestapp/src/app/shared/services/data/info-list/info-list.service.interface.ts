import { Observable } from 'rxjs';

// TODO-refactor type
export interface IInfoListService {
  getVenues(): Observable<any[]>;
  getOrganizers(): Observable<any[]>;
  getEventCategories(): Observable<any[]>;
  getDays(): Observable<any[]>;

  getScheduleUpdate(): Observable<any[]>;
}