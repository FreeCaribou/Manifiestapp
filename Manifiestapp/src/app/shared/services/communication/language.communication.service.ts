import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageEnum } from '../../models/LocalStorage.enum';

@Injectable({
  providedIn: 'root'
})
export class LanguageCommunicationService {
  acceptedLanguages = ['fr', 'nl'];
  selectedLanguage: string;

  langHasChangeEvent = new EventEmitter<string>();

  constructor(
    public translate: TranslateService,
    public router: Router,
  ) { }

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

    this.langHasChangeEvent.emit(this.selectedLanguage);

    // Problem with id data from wp backend
    // The id is not same for the same event depending of the lang
    // Forcing go home to force each page to reload the data, right data
    this.router.navigate(['/home']);
  }
}