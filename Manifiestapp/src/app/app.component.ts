import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LocalNotifications } from '@capacitor/local-notifications';
import { MenuController, ModalController, Platform } from '@ionic/angular';
import { of, Subscription } from 'rxjs';
import { SelectLangComponent } from './shared/components/select-lang/select-lang.component';
import { NotificationEventEnum } from './shared/models/NotificationEvent.enum';
import { LanguageCommunicationService } from './shared/services/communication/language.communication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Home', url: 'home', icon: 'home' },
    { title: 'Programme', url: 'programme', icon: 'receipt' },
    { title: 'Favorite', url: 'favorite', icon: 'star' },
    { title: 'Map', url: 'map', icon: 'map' },
    { title: 'About', url: 'about', icon: 'information-circle' },
    { title: 'BuyTicket', url: 'buy-ticket', icon: 'ticket' },
  ];

  subBackButton: Subscription;
  subRouter: Subscription;
  showPlaylistButton = true;

  openLangModal = false;

  constructor(
    public platform: Platform,
    public languageCommunication: LanguageCommunicationService,
    public router: Router,
    public menu: MenuController,
    public modalController: ModalController
  ) {
  }

  async ngOnInit() {
    this.init();
    await LocalNotifications.requestPermissions();
    LocalNotifications.addListener('localNotificationActionPerformed', (n) => {
      if (n.actionId === 'tap') {
        if (n.notification.actionTypeId === NotificationEventEnum.EventFav) {
          this.router.navigate(['/programme', 'event-detail', n.notification.id])
        }
      }
    });

    this.languageCommunication.langHasChangeEvent.subscribe(l => {
      this.menu.close();
    });
  }

  async init() {
    this.languageCommunication.init();

    console.log('You use the platform: ', this.platform.platforms(), this.languageCommunication.translate.currentLang);

    // when the user tap on the physical back button of the device, we want to close the app
    // but not for all page !
    const pageWithoutBackButton = [
      '/programme/event-detail'
    ];
    this.subRouter = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showPlaylistButton = !event.urlAfterRedirects.includes('/manifiesta-playlist');

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
    })
  }

  async languageSegmentChanged(event) {
    // this.languageCommunication.changeLanguage(event.detail.value);

    await this.presentModalSelectLang(event);
  }

  async presentModalSelectLang(event) {
    this.menu.close();
    const modal = await this.modalController.create({
      component: SelectLangComponent
    });
    modal.present();
    const { data } = await modal.onDidDismiss();

    if (data?.change) {
      this.languageCommunication.changeLanguage(event);
      LocalNotifications.getPending().then(n => {
        LocalNotifications.cancel({ notifications: n.notifications }).finally(() => {
          localStorage.removeItem('favoriteId');

          // Problem with id data from wp backend
          // The id is not same for the same event depending of the lang
          // Forcing go home to force each page to reload the data, right data
          this.router.navigate(['/home']);
        });
      });
    }
  }

  ionViewWillLeave() {
    this.subRouter?.unsubscribe();
    this.subBackButton?.unsubscribe();
  }
}
