import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Network } from '@capacitor/network';
import { IonModal, MenuController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SelectLangComponent } from 'src/app/shared/components/select-lang/select-lang.component';
import { DayListEventInterface, EventInterface } from 'src/app/shared/models/Event.interface';
import { LocalStorageEnum } from 'src/app/shared/models/LocalStorage.enum';
import { LanguageCommunicationService } from 'src/app/shared/services/communication/language.communication.service';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';
import { SellingService } from 'src/app/shared/services/data/selling/selling.service';
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
  // for the seller connection
  iWantSell: boolean;
  sellerDepartement: string;
  sellerPostalCode: string;
  sellerSellingGoal: number;
  departements = [];
  // for the internet connection
  connected = true;
  volunteerName: string;

  @ViewChild('advantageModal') advantageModal: IonModal;
  @ViewChild('insuranceModal') insuranceModal: IonModal;

  constructor(
    private programmeService: ProgrammeService,
    public languageCommunication: LanguageCommunicationService,
    public loadingCommunication: LoadingCommunicationService,
    public router: Router,
    public menu: MenuController,
    public modalController: ModalController,
    private volunteerShiftService: VolunteerShiftService,
    private formBuilder: FormBuilder,
    private sellingService: SellingService,
  ) {
    this.checkAvoidNotification();
  }

  ionViewWillEnter() {
    Network.getStatus().then(n => {
      this.connected = n.connected;
      this.isConnected = this.volunteerShiftService.isConnectedToBeeple();
      this.loginForm = this.buildLoginForm();
      // this.favorieChangeEmit = this.programmeService.favoriteChangeEmit.subscribe(() => this.fetchFavoriteProgramme());
      // this.fetchFavoriteProgramme();
      // this.fetchShifts();
      if (this.isConnected) {
        this.verifySellerData();
        this.volunteerName = localStorage.getItem(LocalStorageEnum.VolunteerName);
      }
    });
  }

  verifySellerData() {
    if (this.departements.length === 0) {
      this.loadAllDepartement();
    }
    this.iWantSell = localStorage.getItem(LocalStorageEnum.VolunteerWantSell) as unknown as boolean;
    this.sellerDepartement = localStorage.getItem(LocalStorageEnum.SellerDepartment);
    this.sellerPostalCode = localStorage.getItem(LocalStorageEnum.SellerPostalCode);
    this.sellerSellingGoal = parseInt(localStorage.getItem(LocalStorageEnum.SellerSellingGoal));
    this.volunteerShiftService.sendSellerVerificationEmit();
  }

  onIWantSellChange(event) {
    if (event.detail?.checked) {
      localStorage.setItem(LocalStorageEnum.VolunteerWantSell, 'true');
    } else {
      localStorage.removeItem(LocalStorageEnum.VolunteerWantSell);
    }
    this.verifySellerData();
  }

  // TODO verification real post code
  onSellerDepartementChange(event) {
    if (event.detail?.value) {
      localStorage.setItem(LocalStorageEnum.SellerDepartment, event.detail?.value);
    } else {
      localStorage.removeItem(LocalStorageEnum.SellerDepartment);
    }
    this.verifySellerData();
  }

  onSellerPostalCodeChange(event) {
    console.log('post change', event)
    const postalCode = event.detail?.value;
    if (!!postalCode) {
      localStorage.setItem(LocalStorageEnum.SellerPostalCode, postalCode);
    } else {
      localStorage.removeItem(LocalStorageEnum.SellerPostalCode);
    }
    this.verifySellerData();
  }

  onSellerSellingGoal(event) {
    console.log('selling goal change', event, isNaN(event.detail?.value))
    const sellingGoal = event.detail?.value;
    if (isNaN(sellingGoal)) {
      localStorage.removeItem(LocalStorageEnum.SellerSellingGoal);
    } else {
      if (!!sellingGoal) {
        localStorage.setItem(LocalStorageEnum.SellerSellingGoal, sellingGoal);
      } else {
        localStorage.removeItem(LocalStorageEnum.SellerSellingGoal);
      }
    }
    this.verifySellerData();
  }

  loadAllDepartement() {
    this.loadingCommunication.changeLoaderTo(true);
    this.sellingService.getAllDepartments().subscribe(data => {
      this.departements = data;
      this.verifySellerData();
    }).add(() => { this.loadingCommunication.changeLoaderTo(false); })
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
          localStorage.removeItem(LocalStorageEnum.OfflineFavorites);
          localStorage.removeItem(LocalStorageEnum.OfflineProgrammes);
          localStorage.removeItem(LocalStorageEnum.OfflineDays);

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
      // this.fetchShifts(true);
      this.verifySellerData();
      localStorage.setItem(LocalStorageEnum.VolunteerName, user.name);
      this.volunteerName = localStorage.getItem(LocalStorageEnum.VolunteerName);
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
    localStorage.removeItem(LocalStorageEnum.OfflineShifts);
    this.verifySellerData();
    this.volunteerName = undefined;
    localStorage.removeItem(LocalStorageEnum.VolunteerName);
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

  openAdvantageModal() {
    this.advantageModal.present();
  }

  closeAdvantageModal() {
    this.advantageModal.dismiss();
  }

  openInsuranceModal() {
    this.insuranceModal.present();
  }

  closeInsuranceModal() {
    this.insuranceModal.dismiss();
  }

  ngOnDestroy() {
    if (this.favorieChangeEmit) {
      this.favorieChangeEmit.unsubscribe();
    }
  }

}
