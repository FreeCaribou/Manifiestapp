import { registerLocaleData } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { VolunteerShiftService } from './shared/services/data/volunteer-shift/volunteer-shift.service';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { BackButtonCommunicationService } from './shared/services/communication/back-buttton.communication.service';
import { SellingPage } from './pages/selling/selling.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Home', url: 'home', icon: 'home' },
    { title: 'Programme', url: 'programme', icon: 'calendar' },
    { title: 'News', url: 'news-info', icon: 'newspaper' },
    { title: 'MyManifiesta', url: 'my-manifiesta', icon: 'person-circle' },
    { title: 'Selling', url: 'selling', icon: 'ticket' },
    { title: 'About', url: 'about', icon: 'information-circle' },
    // { title: 'Map', url: 'map', icon: 'map' },
  ];

  subBackButton: Subscription;
  subRouter: Subscription;
  sellerAccessDataChangeEmit: Subscription;

  showNewsletterButton = true;
  pagesToShowNewsletterButton = ['/home', '/news-info', '/new-detail']

  openLangModal = false;

  isLoading = true;
  loader;

  constructor(
    public platform: Platform,
    public volunteerShiftService: VolunteerShiftService,
    public languageCommunication: LanguageCommunicationService,
    public loadingCommunication: LoadingCommunicationService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public menu: MenuController,
    public modalController: ModalController,
    public translate: TranslateService,
    public toastController: ToastController,
    public infoListService: InfoListService,
    public programmeService: ProgrammeService,
    public loadingController: LoadingController,
    private zone: NgZone,
    private backButtonBlock: BackButtonCommunicationService,
  ) { }

  async ngOnInit() {
    // await LocalNotifications.requestPermissions();

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
    // more routing init
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        const slug = event.url.includes('mycallbackscheme://selling');
        // Expected url call back
        // mycallbackscheme://seller?action=sale&amount=101&clientTransactionId=&message=(-4) USER_CANCEL&status=fail&tid=16220044
        if (slug || event.url === 'selling') {
          this.router.navigateByUrl(`${event.url.replace('mycallbackscheme://', '/')}&timestamp=${new Date().getTime()}`);
        }
        // If no match, do nothing - let regular routing
        // logic take over
      });
    });

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
            position: 'bottom',
            duration: 7000
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

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      tap(event => {
        this.showNewsletterButton = this.pagesToShowNewsletterButton.findIndex(x => event['urlAfterRedirects'].includes(x)) > -1;
      }),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild
        return route
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(snapshotData => {
      this.subBackButton?.unsubscribe();

      this.subBackButton = this.platform.backButton.subscribe(() => {
        const app = 'app';
        this.menu.isOpen().then(data => {
          // We need to verify that we are not on the menu
          if (!data && !snapshotData.noBackExit && this.backButtonBlock.blockReference?.length === 0) {
            navigator[app].exitApp();
          } else if (this.backButtonBlock.blockReference?.length > 0 && this.backButtonBlock.blockReference.includes(SellingPage.name)) {
            this.backButtonBlock.sendGoBackToSellingPage();
          }
        });
      });
    });
  }

  ionViewWillLeave() {
    this.subRouter?.unsubscribe();
    this.subBackButton?.unsubscribe();
  }
}
