import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Network } from '@capacitor/network';
import { isPlatform, MenuController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SelectLangComponent } from 'src/app/shared/components/select-lang/select-lang.component';
import { DayListEventInterface, EventInterface } from 'src/app/shared/models/Event.interface';
import { LocalStorageEnum } from 'src/app/shared/models/LocalStorage.enum';
import { LanguageCommunicationService } from 'src/app/shared/services/communication/language.communication.service';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';
import { VolunteerShiftService } from 'src/app/shared/services/data/volunteer-shift/volunteer-shift.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-manifiesta',
  templateUrl: './my-manifiesta.page.html',
})
export class MyManifiestaPage implements OnDestroy {
  list: DayListEventInterface[];
  favorieChangeEmit: Subscription;
  dateJustWithHour = false;
  haveConflict = false;
  shifts = [];
  loginForm: FormGroup;
  // for the beeple connection
  isConnected = false;
  acceptNotification = false;
  hadLoginError = false;
  // for the internet connection
  connected = true;

  constructor(
    private programmeService: ProgrammeService,
    public languageCommunication: LanguageCommunicationService,
    public loadingCommunication: LoadingCommunicationService,
    public router: Router,
    public menu: MenuController,
    public modalController: ModalController,
    private volunteerShiftService: VolunteerShiftService,
    private formBuilder: FormBuilder
  ) {
    this.checkAvoidNotification();
  }

  ionViewWillEnter() {
    Network.getStatus().then(n => {
      this.connected = n.connected;
      this.isConnected = this.volunteerShiftService.isConnectedToBeeple();
      this.loginForm = this.buildLoginForm();
      this.favorieChangeEmit = this.programmeService.favoriteChangeEmit.subscribe(() => this.fetchFavoriteProgramme());
      this.fetchFavoriteProgramme();
      this.fetchShifts();
    });
  }

  checkAvoidNotification() {
    // For the storage we do the opposite of the view
    // In this way I dont have to manage a default value at the launch of the app
    if (localStorage.getItem(LocalStorageEnum.AvoidNotification)) {
      this.acceptNotification = false;
    } else {
      this.acceptNotification = true;
    }
  }

  async onChangeAcceptNotification(event) {
    this.loadingCommunication.changeLoaderTo(true);
    this.acceptNotification = !this.acceptNotification;

    if (this.acceptNotification) {
      localStorage.removeItem(LocalStorageEnum.AvoidNotification);
      await this.programmeService.addAllNotification();
    } else {
      localStorage.setItem(LocalStorageEnum.AvoidNotification, 'true');
      await this.programmeService.cancelAllEventNotif();
    }

    this.loadingCommunication.changeLoaderTo(false);
  }

  fetchShifts(reloadFav = false) {
    if (this.volunteerShiftService.isConnectedToBeeple()) {
      if (this.connected) {
        this.loadingCommunication.changeLoaderTo(true);
        this.volunteerShiftService.getShifts().subscribe(d => {
          this.shifts = d;
          if (reloadFav) {
            this.fetchFavoriteProgramme();
          }
        }).add(() => { this.loadingCommunication.changeLoaderTo(false); });
      } else {
        this.shifts = this.volunteerShiftService.getOfflineList();
      }
    }
  }

  fetchFavoriteProgramme() {
    if (this.connected) {
      this.loadingCommunication.changeLoaderTo(true);
      this.programmeService.getFavoriteProgramme().subscribe(data => {
        this.list = this.programmeService.mapListEventToDayListEvent(data);
        this.programmeService.setOfflineFavoritesList(this.list);
        this.haveConflict = data.findIndex(e => e.inFavoriteConflict) > -1;
      }).add(() => { this.loadingCommunication.changeLoaderTo(false); });
    } else {
      this.list = this.programmeService.getOfflineFavoritesList();
    }
  }

  ionViewWillLeave() {
    this.list = [];
  }

  async languageSegmentChanged(event) {
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

  buildLoginForm() {
    return this.formBuilder.group({
      email: [environment.dataMock ? 'samy.gnu@mymanifiesta.be' : '', [Validators.required]],
      password: [environment.dataMock ? 'babyDontHurtMeNoMore' : '', Validators.required],
    });
  }

  clickOnLogin() {
    this.loadingCommunication.changeLoaderTo(true);
    this.volunteerShiftService.login(this.loginForm.value).subscribe(user => {
      this.isConnected = this.volunteerShiftService.isConnectedToBeeple();
      this.fetchShifts(true);
    }, error => {
      console.error(error); this.hadLoginError = true;
    }).add(() => { this.loadingCommunication.changeLoaderTo(false); });
  }

  clickOnLogout() {
    this.volunteerShiftService.logout();
    this.shifts = [];
    this.volunteerShiftService.setOfflineList([]);
    this.isConnected = this.volunteerShiftService.isConnectedToBeeple();
    this.fetchFavoriteProgramme();
  }

  async seeBeeple() {
    await Browser.open({
      url: 'https://volunteers.manifiesta.be/' + this.languageCommunication.selectedLanguage,
      toolbarColor: '#f18904'
    });
  }

  async clickOnDeleteAccount() {
    await Browser.open({
      url: `https://volunteers.manifiesta.be/${this.languageCommunication.selectedLanguage}/settings`,
      toolbarColor: '#f18904'
    });
  }

  ngOnDestroy() {
    if (this.favorieChangeEmit) {
      this.favorieChangeEmit.unsubscribe();
    }
  }

}
