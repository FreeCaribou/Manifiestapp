import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SellersService {

  constructor(private http: HttpClient) { }

  getAllPossibleDepartments(): Observable<any> {
    return this.http.get<any[]>(`${environment.apiUrl}departments/nl`);
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}sellers/2024`);
  }

  getAllSellingInformation(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}admins/sellingsInformations/2024`,
      { headers: { token: localStorage.getItem('admin-token') as string } }
    );
  }

  getAllSellerSellingInformation(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}admins/sellingsInformations/sellers/2024`,
      { headers: { token: localStorage.getItem('admin-token') as string } }
    );
  }

  getAllDepartmentSellingInformation(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}admins/sellingsInformations/departments/2024`,
      { headers: { token: localStorage.getItem('admin-token') as string } }
    );
  }

  getAllPhysicalTickets(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}admins/physicalTickets`,
      { headers: { token: localStorage.getItem('admin-token') as string } }
    );
  }

  physicalTicketSendDone(id: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}admins/physicalTickets/sendDone/${id}`,
      { headers: { token: localStorage.getItem('admin-token') as string } }
    );
  }

  getOrderNotFinish(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}admins/sellingsInformations/order-not-finish/2024`,
      { headers: { token: localStorage.getItem('admin-token') as string } }
    );
  }

  finishOrder(body: any): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}admins/finishOrderPending/${body.vwTransactionId}`,
      { headers: { token: localStorage.getItem('admin-token') as string } }
    );
  }

  getAllFinishSellingsInformationTickets(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}admins/sellingsInformations/sellings-tickets/2024`,
      { headers: { token: localStorage.getItem('admin-token') as string } }
    );
  }

  finishOrders(arrayOfBody: any[]): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}admins/sellingsInformations/finish-order-array`,
      arrayOfBody,
      { headers: { token: localStorage.getItem('admin-token') as string } }
    );
  }

  beepleFunctions(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}admins/beeple/functions`,
      { headers: { token: localStorage.getItem('admin-token') as string } }
    );
  }

  editSellingInformation(id: number, body: any): Observable<any> {
    return this.http.put<any>(
      `${environment.apiUrl}admins/sellingsInformations/${id}`,
      body,
      { headers: { token: localStorage.getItem('admin-token') as string } }
    );
  }

}
