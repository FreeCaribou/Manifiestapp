import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageEnum } from '../../models/LocalStorage.enum';

@Injectable({
  providedIn: 'root'
})
export class LanguageCommunicationService {
  acceptedLanguages = ['en', 'fr', 'nl'];
  selectedLanguage: string;

  constructor(public translate: TranslateService) { }

  init() {
    this.translate.addLangs(this.acceptedLanguages);

    if (!localStorage.getItem(LocalStorageEnum.Language)) {
      this.changeLanguage(window.navigator.language.slice(0, 2));
    } else {
      this.changeLanguage(localStorage.getItem(LocalStorageEnum.Language));
    }

    this.translate.setDefaultLang('nl');
  }

  changeLanguage(language: string) {
    if (!this.acceptedLanguages.includes(language)) {
      language = 'nl';
    }
    localStorage.setItem(LocalStorageEnum.Language, language);
    this.translate.use(localStorage.getItem(LocalStorageEnum.Language));
    this.selectedLanguage = localStorage.getItem(LocalStorageEnum.Language);
  }
}