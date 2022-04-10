import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from "src/environments/environment";
import { BaseService } from "../base.service";
import { map, tap } from 'rxjs/operators';
import { LanguageCommunicationService } from "../../communication/language.communication.service";
import { NewInfoInterface } from "src/app/shared/models/NewInfo.interface";


@Injectable({
  providedIn: 'root'
})
export class NewsListService {

  baseUrl = `${environment.baseUrl}posts`;

  constructor(
    private baseService: BaseService,
    private languageService: LanguageCommunicationService,
  ) {
    this.languageService.langHasChangeEvent.subscribe(e => {
      this.resetInfoListCache();
    })
  }

  allNews: NewInfoInterface[] = [];
  stickyNews: NewInfoInterface[] = [];
  // sticky = important in the wordpress language
  getInfos(onlySticky = false): Observable<NewInfoInterface[]> {
    if ((this.allNews?.length === 0 && !onlySticky) || (this.stickyNews?.length === 0 && onlySticky)) {
      return this.baseService.get(
        `${this.baseUrl}?_embed=wp:featuredmedia&lang=${this.languageService.selectedLanguage}${onlySticky ? '&sticky=true' : ''}&per_page=100`
      ).pipe(
        map(data => { return data.map(e => { return this.mapRawWpDataToClearData(e) }); }),
        tap(n => {
          if (onlySticky) {
            this.stickyNews = n;
          } else {
            this.allNews = n;
          }
        })
      );
    } else {
      if (onlySticky) {
        return of(this.stickyNews);
      } else {
        return of(this.allNews);
      }
    }
  }

  getInfo(id: string): Observable<NewInfoInterface> {
    return this.baseService.get(
      `${this.baseUrl}/${id}?_embed=wp:featuredmedia&lang=${this.languageService.selectedLanguage}`
    ).pipe(
      map(n => this.mapRawWpDataToClearData(n))
    );
  }

  mapRawWpDataToClearData(newInfo: NewInfoInterface): NewInfoInterface {
    newInfo.headline = newInfo.title?.rendered;
    newInfo.mainPictureUrl = newInfo._embedded?.['wp:featuredmedia'] ?
      newInfo._embedded?.['wp:featuredmedia'][0]?.source_url : 'assets/pictures/manifiesta-title-logo.jpg';
    newInfo.allText = newInfo.content?.rendered;
    newInfo.shortText = newInfo.excerpt?.rendered;
    return newInfo;
  }

  resetInfoListCache() {
    this.allNews = [];
    this.stickyNews = [];
  }

}