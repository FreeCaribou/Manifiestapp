import { registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LocalNotifications } from '@capacitor/local-notifications';
import { MenuController, ModalController, Platform, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificationEventEnum } from './shared/models/NotificationEvent.enum';
import { LanguageCommunicationService } from './shared/services/communication/language.communication.service';
import { LoadingCommunicationService } from './shared/services/communication/loading.communication.service';
import localeFr from '@angular/common/locales/fr';
import localeNl from '@angular/common/locales/nl';
import { Network } from '@capacitor/network';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Home', url: 'home', icon: 'home' },
    { title: 'Programme', url: 'programme', icon: 'calendar' },
    { title: 'MyManifiesta', url: 'my-manifiesta', icon: 'person-circle' },
    { title: 'News', url: 'news-info', icon: 'newspaper'},
    // { title: 'Map', url: 'map', icon: 'map' },
    { title: 'About', url: 'about', icon: 'information-circle' },
    // { title: 'BuyTicket', url: 'buy-ticket', icon: 'ticket' },
  ];

  subBackButton: Subscription;
  subRouter: Subscription;

  showNewsletterButton = true;
  pagesToShowNewsletterButton = ['/home', '/news-info', '/new-detail']

  openLangModal = false;

  isLoading = true;
  loader;

  constructor(
    public platform: Platform,
    public languageCommunication: LanguageCommunicationService,
    public loadingCommunication: LoadingCommunicationService,
    public router: Router,
    public menu: MenuController,
    public modalController: ModalController,
    public translate: TranslateService,
    public toastController: ToastController,
  ) {
  }

  async ngOnInit() {
    Network.getStatus().then(n => {
      if (!n.connected) {
        this.translate.get('General.NoConnection').subscribe(t => {
          this.toastController.create({
            message: t,
            icon: 'alert-circle-outline',
            color: 'danger',
            position: 'top',
            duration: 5000
          }).then(toast => {
            toast.present();
          });
        });
      }
    });

    this.init();
    await LocalNotifications.requestPermissions();
    LocalNotifications.addListener('localNotificationActionPerformed', (n) => {
      if (n.actionId === 'tap') {
        if (n.notification.actionTypeId === NotificationEventEnum.EventFav) {
          this.router.navigate(['/programme', 'event-detail', n.notification.id]);
        }
      }
    });

    this.languageCommunication.langHasChangeEvent.subscribe(l => {
      this.menu.close();
    });

  }

  async init() {
    registerLocaleData(localeFr);
    registerLocaleData(localeNl);
    this.languageCommunication.init();
    console.log('You use the platform: ',
    this.platform.platforms(),
    this.languageCommunication.translate.currentLang, environment.production);
    // when the user tap on the physical back button of the device, we want to close the app
    // but not for all page !
    const pageWithoutBackButton = [
      '/programme/event-detail'
    ];
    this.subRouter = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNewsletterButton = this.pagesToShowNewsletterButton.findIndex(x => event.urlAfterRedirects.includes(x)) > -1;

        this.subBackButton?.unsubscribe();
        if (!pageWithoutBackButton.find(x => event.urlAfterRedirects.includes(x))) {
          this.subBackButton = this.platform.backButton.subscribe(() => {
            const app = 'app';
            this.menu.isOpen().then(data => {
              if (!data) {
                navigator[app].exitApp();
              }
            });

          });
        }

      }
    });
  }

  ionViewWillLeave() {
    this.subRouter?.unsubscribe();
    this.subBackButton?.unsubscribe();
  }
}
