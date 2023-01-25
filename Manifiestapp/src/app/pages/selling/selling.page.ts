import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal, ModalController, Platform, ToastController } from '@ionic/angular';
import { LocalStorageEnum } from 'src/app/shared/models/LocalStorage.enum';
import { LanguageCommunicationService } from 'src/app/shared/services/communication/language.communication.service';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { SellingService } from 'src/app/shared/services/data/selling/selling.service';
import { i18nTerms } from 'src/app/shared/utils/i18n-terms';
import { environment } from 'src/environments/environment';
import { AppAvailability } from '@awesome-cordova-plugins/app-availability/ngx';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { VolunteerShiftService } from 'src/app/shared/services/data/volunteer-shift/volunteer-shift.service';
import { SellingPostInfoModalComponent } from 'src/app/shared/components/selling-post-info-modal/selling-post-info-modal.component';
import { takeUntil } from 'rxjs/operators'
import { Observable, Subject, Subscription } from 'rxjs';

// TODO Rework EVERYTHING
@Component({
  selector: 'app-selling',
  templateUrl: './selling.page.html',
})
export class SellingPage implements AfterViewInit {

  departments = [];
  buyForm: FormGroup;
  addressForm: FormGroup;
  hadLoginError: false;
  seller;
  sellerSellingGoal: number;
  ticketTypes = [];
  ticketNumberOfSell: { ticketId: string, ticketAmount: number, ticketPrice: number }[] = [];
  mySellingInfo;
  sellerName;

  status: string;
  action: string;
  message: string;
  transactionId: string;
  routerUrl: string;

  progress = 0;

  showClientDetailForm = false;

  vivaWalletInstall = false;
  bluetoothActivated = false;
  gpsActivated = false;
  nfcActivated = false;

  showAfterSellingModal = false;
  @ViewChild('afterSellingModal') afterSellingModal: IonModal;
  @ViewChild('myInfoModal') myInfoModal: IonModal;

  destroyer$ = new Subject();
  routeSubscribe$: Subscription;

  clientTransactionId: string;

  clientAcceptData = false;
  clientWantNewsletter = false;

  constructor(
    private formBuilder: FormBuilder,
    private sellingService: SellingService,
    public loadingCommunication: LoadingCommunicationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private languageService: LanguageCommunicationService,
    public modalController: ModalController,
    private appAvailability: AppAvailability,
    private platform: Platform,
    private diagnostic: Diagnostic,
    public volunteerShiftService: VolunteerShiftService,
  ) { }

  ngAfterViewInit(): void {
    document.addEventListener('visibilitychange', () => {
      this.verifyHardwareForVivaWallet();
    });
  }

  get totalAmount(): number {
    let totalAmount = 0;
    this.ticketNumberOfSell.forEach(t => {
      totalAmount += t.ticketPrice * t.ticketAmount;
    });
    return totalAmount;
  }

  get formValid(): boolean {
    return this.buyForm?.value?.askSendTicket ? this.buyForm.valid && this.addressForm.valid : this.buyForm.valid;
  }

  get disabledBuyButton(): boolean {
    return this.totalAmount <= 0 || !this.formValid || !this.allHardwareOk || !this.clientAcceptData;
  }

  get allHardwareOk(): boolean {
    return this.vivaWalletInstall && this.nfcActivated && this.gpsActivated;
    // return this.vivaWalletInstall && this.bluetoothActivated && this.nfcActivated && this.gpsActivated;
  }

  get recapSelectedTicket(): any[] {
    return this.ticketNumberOfSell
      .filter(t => t.ticketAmount > 0)
      .map(t => {
        return {
          ticketId: t.ticketId,
          ticketAmount: t.ticketAmount,
          ticketTotalPrice: t.ticketPrice * t.ticketAmount,
          ticketPrice: t.ticketPrice,
          ticketLabel: this.ticketTypes?.find(x => x.id === t.ticketId).name
        }
      });
  }

  get sellerSendingDataI18NParam() {
    return {
      totalSelling: this.mySellingInfo?.data?.length,
      totalTickets: this.mySellingInfo?.totalAmountTicket
    };
  }

  get sellerNameI18NParam() {
    return {sellerName: this.sellerName}
  }

  get progressGetter() {
    return this.progress;
  }

  verifyBluetooth() {
    this.diagnostic.isBluetoothEnabled()
      .then(e => { console.log('bluetooth is ok', e); this.bluetoothActivated = e; })
      .catch(e => { console.log('bluetooth is not ok'); this.bluetoothActivated = false; });
  }

  verifyNfc() {
    this.diagnostic.isNFCEnabled()
      .then(e => { console.log('nfc is ok', e); this.nfcActivated = e; })
      .catch(e => { console.log('nfc is not ok'); this.nfcActivated = false; });
  }

  verifyGps() {
    this.diagnostic.isGpsLocationEnabled()
      .then(e => { console.log('gps is ok', e); this.gpsActivated = e; })
      .catch(e => { console.log('gps is not ok'); this.gpsActivated = false; });
  }

  verifyVivaWallet() {
    if (this.platform.is('android')) {
      const app = 'com.vivawallet.spoc.payapp';
      this.appAvailability.check(app)
        .then(
          (yes: boolean) => { console.log(app + ' is available'); this.vivaWalletInstall = true },
          (no: boolean) => { console.log(app + ' is NOT available'); this.vivaWalletInstall = false }
        );
    }
  }

  goInstallVivaWallet() {
    if (this.platform.is('android')) {
      window.open(
        'market://details?id=com.vivawallet.spoc.payapp', '_system'
      );
    }
  }

  goActiveBluetooth() {
    if (this.platform.is('android')) {
      this.diagnostic.switchToBluetoothSettings();
    }
  }

  goActiveGps() {
    if (this.platform.is('android')) {
      this.diagnostic.switchToLocationSettings();
    }
  }

  goActiveNfc() {
    if (this.platform.is('android')) {
      this.diagnostic.switchToNFCSettings();
    }
  }

  verifyHardwareForVivaWallet() {
    this.verifyVivaWallet();
    // this.verifyBluetooth();
    this.verifyGps();
    this.verifyNfc();

    // this.diagnostic.registerBluetoothStateChangeHandler(() => {
    //   this.verifyBluetooth();
    // });

    this.diagnostic.registerNFCStateChangeHandler(() => {
      this.verifyNfc();
    });

    this.diagnostic.registerLocationStateChangeHandler(() => {
      this.verifyGps();
    });
  }

  ionViewDidLeave() {
    console.log('leave')
    this.destroyer$.next(true);
    this.destroyer$.complete();

    this.routeSubscribe$?.unsubscribe();
  }

  ionViewWillEnter() {
    console.log('enter')
    this.sellerSellingGoal = this.volunteerShiftService.getSellerSellingGoal();
    this.buyForm = this.buildBuyForm();
    this.addressForm = this.builAddressForm();
    this.sellerName = localStorage.getItem(LocalStorageEnum.VolunteerName);
    this.verifyHardwareForVivaWallet();

    // this.destroyer$?.unsubscribe();
    // this.destroyer$?.complete();
    this.routeSubscribe$ = this.activatedRoute.queryParams.pipe(takeUntil(this.destroyer$)).subscribe((queryParams) => {
      console.log('query param ?', queryParams, this.activatedRoute.snapshot.queryParamMap)
      this.status = queryParams['status'] || this.activatedRoute.snapshot.queryParamMap.get('status');
      this.message = queryParams['message'] || this.activatedRoute.snapshot.queryParamMap.get('message');
      this.action = queryParams['action'] || this.activatedRoute.snapshot.queryParamMap.get('action');
      this.transactionId = queryParams['transactionId'] || this.activatedRoute.snapshot.queryParamMap.get('transactionId');
      this.routerUrl = this.router.url;
      console.log('query param ? v2', this.status, this.message, this.action, this.transactionId, this.routerUrl)

      if (this.status && this.seller && this.action == 'activatePos') {
        console.log('try to activate viva wallet pos')
        if (this.status == 'success' || this.message == 'POS_IS_ALREADY_ACTIVATED') {
          console.log('try to activate viva wallet pos success or already activated', this.totalAmount, this.totalAmount > 0)
          // If we see ticket in the "basket", we show the client detail form
          if (this.totalAmount > 0) {
            console.log('laucnh the client detail form')
            this.showClientDetailForm = true;
            this.clientWantNewsletter = false;
            this.clientAcceptData = false;
          }
          // this.vivaWalletConnectSuccess();
        } else {
          this.vivaWalletError();
        }
      }

      else if (this.status && this.seller && this.action == 'sale') {
        console.log('try to activate viva wallet sale')

        if (this.status == 'success' && this.transactionId) {
          this.showClientDetailForm = false;

          if (this.clientWantNewsletter) {
            this.addClientToNewsletter();
          }

          this.loadingCommunication.changeLoaderTo(true);
          this.sellingService.ticketsSale(
            this.recapSelectedTicket,
            this.buyForm.value.email,
            this.buyForm.value.firstname,
            this.buyForm.value.lastname,
            this.transactionId,
            this.buyForm.value.askSendTicket,
            this.clientTransactionId,
            this.addressForm.value,
          ).pipe(takeUntil(this.destroyer$)).subscribe(data => {
            console.log('tickets sale order', data)
            this.loadThermometer(true);
            this.succeedPaiement();
            // Put at zero the tickets sell amount / number
            this.ticketNumberOfSell = this.ticketTypes.map(t => { return { ticketId: t.id, ticketAmount: 0, ticketPrice: t.price + t.fee } });
            this.transactionId = undefined;
            this.clientTransactionId = undefined;
            this.clientWantNewsletter = false;
            this.clientAcceptData = false;
          }).add(() => { this.loadingCommunication.changeLoaderTo(false); });
        } else {
          this.vivaWalletError();
        }

      }
    });

    this.loadingCommunication.changeLoaderTo(true);
    this.sellingService.verifySellerConnection().subscribe(seller => {
      this.seller = seller;
      this.loadThermometer();
      this.loadTicketType();
    }).add(() => { this.loadingCommunication.changeLoaderTo(false); });
  }

  
  // also delete all the query param of the route
  async succeedPaiement() {
    this.router.navigate(
      [], 
      {
        relativeTo: this.activatedRoute,
        queryParams: {  },
    });
    const message: string = i18nTerms.paiementOk[this.languageService.selectedLanguage];
    const toast = await this.toastController.create({
      header: 'Success',
      message,
      icon: 'checkmark-circle-outline',
      color: 'success',
      duration: 4000,
    });
    toast.present();
  }

  async vivaWalletConnectSuccess() {
    const message: string = i18nTerms.authVivaWalletOk[this.languageService.selectedLanguage];
    const toast = await this.toastController.create({
      header: 'Success',
      message,
      icon: 'checkmark-circle-outline',
      color: 'success',
      duration: 4000,
    });
    toast.present();
  }

  async vivaWalletError() {
    const message: string = i18nTerms.vivaWalletError[this.languageService.selectedLanguage];
    const toast = await this.toastController.create({
      header: 'Viva Wallet Error',
      message,
      icon: 'bug-outline',
      color: 'danger',
      duration: 4000,
    });
    toast.present();
  }

  buildBuyForm() {
    return this.formBuilder.group({
      email: [environment.dataMock ? 'samy.gnu@mymanifiesta.be' : '', [Validators.required, Validators.email]],
      verificationEmail: [environment.dataMock ? 'samy.gnu@mymanifiesta.be' : '', [Validators.required, Validators.email]],
      firstname: [environment.dataMock ? 'Karl' : '', Validators.required],
      lastname: [environment.dataMock ? 'Marx' : '', Validators.required],
      askSendTicket: [false],
    }, { validators: this.verificationEmail() });
  }

  builAddressForm() {
    return this.formBuilder.group({
      street: ['', Validators.required],
      number: ['', Validators.required],
      city: ['', Validators.required],
      postCode: ['', Validators.required],
    });
  }
  
  verificationEmail(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control?.value?.email !== control.value.verificationEmail ? { emailNotEqual: { value: control.value } } : null;
    };
  }

  loadThermometer(showPostSellingModal = false) {
    this.loadingCommunication.changeLoaderTo(true);
    this.sellingService.getMySellingInformation().subscribe(info => {
      this.mySellingInfo = info;
      if (showPostSellingModal) {
        this.openShowAfterSellingModal();
      }
    }).add(() => {this.loadingCommunication.changeLoaderTo(false);});
  }

  loadThermometerView() {
    if (this.mySellingInfo?.totalAmountTicket) {
      this.progress = 0;
      setInterval(() => {
        if (this.progress < (this.mySellingInfo?.totalAmountTicket / this.sellerSellingGoal)) {
          this.progress += 0.025;
        }
      }, 50);
    }
  }

  loadTicketType() {
    this.loadingCommunication.changeLoaderTo(true);
    this.sellingService.getAllTicketTypes().subscribe(tt => {
      this.ticketTypes = tt;
      this.ticketNumberOfSell = this.ticketTypes.map(t => { return { ticketId: t.id, ticketAmount: 0, ticketPrice: t.price + t.fee } });
      console.log('the tickets type', this.ticketTypes, this.ticketNumberOfSell)
    }).add(() => {
      this.loadingCommunication.changeLoaderTo(false);
    });
  }

  /**
   * 
   * @param index the index in the array where we want to change
   * @param type 'remove' or 'add'
   */
  changeAmountTicket(index: number, type: string) {
    if (type === 'add') {
      this.ticketNumberOfSell[index].ticketAmount++;
    } else if (type === 'remove') {
      this.ticketNumberOfSell[index].ticketAmount--;
    }
  }

  buy() {
    if (!this.disabledBuyButton) {
      this.clientTransactionId = `${localStorage.getItem(LocalStorageEnum.BeepleId)}-${new Date().getTime()}`;
      window.open(
        'vivapayclient://pay/v1' +
        '?appId=be.manifiesta.app' +
        '&action=sale' +
        `&amount=${Math.floor(this.totalAmount * 100)}` +
        `&clientTransactionId=${this.clientTransactionId}` +
        '&callback=mycallbackscheme://selling',
        '_system'
      );
    } else {
      // TODO show message error
    }
  }

  autoVivaWalletAuth() {
    console.log('come on auth auto please', this.totalAmount, this.totalAmount * 100, Math.floor(this.totalAmount * 100))
    window.open(
      'vivapayclient://pay/v1' +
      '?appId=be.manifiesta.app' +
      `&apikey=${environment.vwAccessSite}` +
      `&apiSecret=${environment.vwAccessCode}` +
      `&pinCode=${environment.vwPinCode}` +
      '&action=activatePos' +
      '&disableManualAmountEntry=true' +
      '&activateQRCodes=true' +
      '&lockRefund=true' +
      '&lockTransactionsList=true' +
      '&lockMoto=true' +
      '&callback=mycallbackscheme://selling',
      '_system'
    );
  }

  setOpenModal(isOpen: boolean) {
    // To be sur to renew the form
    this.buyForm = this.buildBuyForm();
    this.addressForm = this.builAddressForm();
    this.autoVivaWalletAuth();
  }

  cancelBuy() {
    this.showClientDetailForm = false;
    this.ticketNumberOfSell = this.ticketTypes.map(t => { return { ticketId: t.id, ticketAmount: 0, ticketPrice: t.price + t.fee } });
  }

  async openShowAfterSellingModal() {
    console.log('allller', this.mySellingInfo)
    const modal = await this.modalController.create({
      component: SellingPostInfoModalComponent,
      componentProps: {
        totalAmountTicket: this.mySellingInfo?.totalAmountTicket,
        sellerSellingGoal: this.sellerSellingGoal,
        mySellingInfo: this.mySellingInfo,
        sellerSendingDataI18NParam: this.sellerSendingDataI18NParam,
        sellerNameI18NParam: this.sellerNameI18NParam,
      }
    })
    modal.present();
  }

  goMyDetails() {
    this.router.navigate(['/selling/my-details']);
  }

  onClientAcceptData(event) {
    if (event.detail?.checked) {
      this.clientAcceptData = true;
    } else {
      this.clientAcceptData = false;
    }
  }

  onClientWantNewsletter(event) {
    if (event.detail?.checked) {
      this.clientWantNewsletter = true;
    } else {
      this.clientWantNewsletter = false;
    }
  }

  addClientToNewsletter() {
    this.loadingCommunication.changeLoaderTo(true)
    this.sellingService.newsletterAdd(this.buyForm.value.email, this.buyForm.value.firstname, this.buyForm.value.lastname,)
      .subscribe()
      .add(() => { this.loadingCommunication.changeLoaderTo(false); });
  }

}