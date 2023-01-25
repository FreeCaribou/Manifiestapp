import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { BaseService } from "../base.service";
import { LanguageCommunicationService } from "../../communication/language.communication.service";
import { LocalStorageEnum } from "src/app/shared/models/LocalStorage.enum";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { VolunteerShiftService } from "../volunteer-shift/volunteer-shift.service";

@Injectable({
  providedIn: 'root'
})
export class SellingService {

  baseUrl = `${environment.apiUrl}`;

  departmentsCache = [];

  constructor(
    private baseService: BaseService,
    private languageService: LanguageCommunicationService,
    private volunteerShiftService: VolunteerShiftService,
  ) {
  }

  getAllDepartments(): Observable<any[]> {
    return this.baseService.getCall(`${this.baseUrl}departments`).pipe(tap(d => {this.departmentsCache = d}));
  }

  getAllTicketTypes(): Observable<any[]> {
    let shop = localStorage.getItem(LocalStorageEnum.SellerDepartment) || 'app';
    const shopDivided = shop.split('_');
    // We verify the type of the shop
    if (shopDivided.length === 2) {
      // If it is type Other, we need to check the precision of the type
      if (shopDivided[0] === 'O') {
        switch (shopDivided[1].toLowerCase()) {
          case 'comac':
            shop = 'comac';
            break;
          case 'intal':
            shop = 'intal';
            break;
          default:
            shop = 'app';
            break;
        }
      } else if (shopDivided[0] === 'P') {
        // If it is type Provencie, it's shop app
        shop = 'app';
      } else {
        shop = 'app';
      }
    } else {
      shop = 'app';
    }

    return this.baseService.getCall(`${this.baseUrl}tickets/types/${shop}`);
  }

  connectSeller(body): Observable<any> {
    return this.baseService.postCall(`${this.baseUrl}sellers/connect`, body);
  }

  // TODO check later to have more information
  verifySellerConnection(): Observable<any> {
    const sellerId = localStorage.getItem(LocalStorageEnum.BeepleId);
    if (sellerId && this.volunteerShiftService.isReadyToSellWithData()) {
      return of({ id: localStorage.getItem(LocalStorageEnum.BeepleId), sellTickets: 2, sellTicketsGoal: 10 });
      return this.baseService.getCall(`${this.baseUrl}sellers/${sellerId}`);
    } else {
      return of(null);
    }
  }

  ticketsSale(
    tickets: any[],
    email: string,
    firstname: string,
    lastname: string,
    transactionId: string,
    askSendTicket: boolean,
    clientTransactionId: string,
    address?: any
  ): Observable<any> {
    return this.baseService.postCall(
      `${this.baseUrl}tickets/confirm`,
      {
        firstname,
        lastname,
        email,
        "language": this.languageService.selectedLanguage,
        "ip": "127.0.0.1",
        "agent": "ManifiestApp",
        "invoice": 0,
        "testmode": 0,
        "sellerId": localStorage.getItem(LocalStorageEnum.BeepleId),
        tickets,
        vwTransactionId: transactionId,
        "sellerDepartmentId": localStorage.getItem(LocalStorageEnum.SellerDepartment),
        "sellerPostalCode": localStorage.getItem(LocalStorageEnum.SellerPostalCode),
        askSendTicket,
        address,
        clientTransactionId,
      }
    )
  }

  newsletterAdd(email: string, firstname: string, lastname: string): Observable<any> {
    return this.baseService.postCall(
      `${this.baseUrl}tickets/newsletter-add`,
      {
        firstname,
        lastname,
        email,
        'MMERGE6': this.languageService.selectedLanguage
      }
    )
  }

  getMySellingInformation(): Observable<any> {
    return this.baseService.getCall(
      `${this.baseUrl}tickets/sellingInformation/seller/${localStorage.getItem(LocalStorageEnum.BeepleId)}`
    );
  }

  getMyCurrentDepartmentSellingInformation(): Observable<any> {
    return this.baseService.getCall(
      `${this.baseUrl}tickets/sellingInformation/department/${localStorage.getItem(LocalStorageEnum.SellerDepartment)}`
    );
  }

  getAllSellingInformation(): Observable<any> {
    return this.baseService.getCall(
      `${this.baseUrl}tickets/sellingInformation/seller`
    );
  }

  getMyCurrentPostCodeSellingInformation(): Observable<any> {
    return this.baseService.getCall(
      `${this.baseUrl}tickets/sellingInformation/postCode/${localStorage.getItem(LocalStorageEnum.SellerPostalCode)}`
    );
  }

}