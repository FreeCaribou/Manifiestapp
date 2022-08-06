import { registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LocalNotifications } from '@capacitor/local-notifications';
import { LoadingController, MenuController, ModalController, Platform, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificationEventEnum } from './shared/models/NotificationEvent.enum';
import { LanguageCommunicationService } from './shared/services/communication/language.communication.service';
import { LoadingCommunicationService } from './shared/services/communication/loading.communication.service';
import localeFr from '@angular/common/locales/fr';
import localeNl from '@angular/common/locales/nl';
import { Network } from '@capacitor/network';
import { TranslateService } from '@ngx-translate/core';
import { InfoListService } from './shared/services/data/info-list/info-list.service';
import { LocalStorageEnum } from './shared/models/LocalStorage.enum';
import { ProgrammeService } from './shared/services/data/programme/programme.service';

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
    { title: 'News', url: 'news-info', icon: 'newspaper' },
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
    public infoListService: InfoListService,
    public programmeService: ProgrammeService,
    public loadingController: LoadingController,
  ) {
  }

  async ngOnInit() {
    await LocalNotifications.requestPermissions();

    this.init();

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

  // We need at the launch of the app to verify if there is update of the schedule of event
  // First we get the schedule update file and check if in the local storage we have the last 'code'
  // If not, we need to check and reload the notif with the new hours
  async verifyScheduleUpdate() {
    if (!localStorage.getItem(LocalStorageEnum.AvoidNotification) && localStorage.getItem(LocalStorageEnum.FavoriteId)) {
      const loading = await this.loadingController.create({
        message: 'Please wait...',
        spinner: 'lines'
      });
      await loading?.present();

      this.infoListService.getScheduleUpdate().subscribe(async scheduleUpdate => {
        const code = scheduleUpdate[scheduleUpdate.length - 1].code;
        const codePresent = localStorage.getItem(code);
        if (!codePresent) {
          await this.programmeService.addAllNotification();
          localStorage.setItem(code, 'done');
          await loading?.dismiss();
        } else {
          await loading?.dismiss();
        }
      }).add(async () => { await loading?.dismiss(); });
    }

  }

  async init() {
    registerLocaleData(localeFr);
    registerLocaleData(localeNl);
    this.languageCommunication.init();

    await this.verifyScheduleUpdate();

    Network.getStatus().then(n => {
      if (!n.connected) {
        this.translate.get('General.NoConnection').subscribe(t => {
          this.toastController.create({
            header: 'INTERNET ?',
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

    console.log('You use the platform: ',
      this.platform.platforms(),
      this.languageCommunication.translate.currentLang, environment.production
    );
    // when the user tap on the physical back button of the device, we want to close the app
    // but not for all page !
    const pageWithoutBackButton = [
      '/programme/event-detail',
      '/programme/new-detail'
    ];
    this.showNewsletterButton = this.pagesToShowNewsletterButton.findIndex(x => this.router.url.includes(x)) > -1;
    this.router.events.subscribe(event => {
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
