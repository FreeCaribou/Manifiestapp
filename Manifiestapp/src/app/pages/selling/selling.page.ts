import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal, MenuController, ModalController, Platform, ToastController } from '@ionic/angular';
import { LocalStorageEnum } from 'src/app/shared/models/LocalStorage.enum';
import { LanguageCommunicationService } from 'src/app/shared/services/communication/language.communication.service';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { SellingService } from 'src/app/shared/services/data/selling/selling.service';
import { i18nTerms } from 'src/app/shared/utils/i18n-terms';
import { environment } from 'src/environments/environment';
import { VolunteerShiftService } from 'src/app/shared/services/data/volunteer-shift/volunteer-shift.service';
import { SellingPostInfoModalComponent } from 'src/app/shared/components/selling-post-info-modal/selling-post-info-modal.component';
import { takeUntil } from 'rxjs/operators'
import { Subject, Subscription } from 'rxjs';
import { SellerDepartmentInfoModalComponent } from 'src/app/shared/components/seller-department-info-modal/seller-department-info-modal.component';
import { BackButtonCommunicationService } from 'src/app/shared/services/communication/back-buttton.communication.service';
import { VivaWalletVerificationCommunicationService } from 'src/app/shared/services/communication/viva-wallet-verification.communication.service';

// TODO Rework EVERYTHING
@Component({
  selector: 'app-selling',
  templateUrl: './selling.page.html',
})
export class SellingPage {

  departments = [];
  buyForm: FormGroup;
  addressForm: FormGroup;
  sellerLoginForm: FormGroup;
  hadLoginError: false;
  seller;
  ticketTypes = [];
  ticketNumberOfSell: { ticketId: string, ticketAmount: number, ticketPrice: number }[] = [];
  mySellingInfo;

  status: string;
  action: string;
  message: string;
  transactionId: string;
  // same than transaction id, but via smartcheckout
  t: string;
  routerUrl: string;

  progress = 0;

  showClientDetailForm = false;

  showAfterSellingModal = false;
  @ViewChild('afterSellingModal') afterSellingModal: IonModal;
  @ViewChild('myInfoModal') myInfoModal: IonModal;

  destroyer$ = new Subject();
  routeSubscribe$: Subscription;

  clientTransactionId: string;

  clientAcceptData = false;
  clientWantNewsletter = false;

  // for the seller connection
  sellerDepartement: string;
  sellerPostalCode: string;
  sellerSellingGoal: number;
  departements = [];

  sellerAcceptData = false;

  finishSellingInfo;

  isIos = false;
  noPOS = false;

  constructor(
    private formBuilder: FormBuilder,
    private sellingService: SellingService,
    public loadingCommunication: LoadingCommunicationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private languageService: LanguageCommunicationService,
    public modalController: ModalController,
    public volunteerShiftService: VolunteerShiftService,
    private backButtonBlock: BackButtonCommunicationService,
    public menu: MenuController,
    private vivaWalletVerification: VivaWalletVerificationCommunicationService,
    private platform: Platform,
  ) { }

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
    if (this.isIos) {
      return true;
    }
    return this.vivaWalletVerification.vivaWalletInstall
      && (this.vivaWalletVerification.nfcActivated || localStorage.getItem(LocalStorageEnum.KnowNotNFC))
      && this.vivaWalletVerification.gpsActivated && localStorage.getItem(LocalStorageEnum.KnowPayconic) as unknown as boolean;
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
    return { sellerName: this.sellerName }
  }

  get progressGetter() {
    return this.progress;
  }

  get isLogin() {
    return localStorage.getItem(LocalStorageEnum.SellerEmail) && localStorage.getItem(LocalStorageEnum.SellerName);
  }

  get hasEveryInfoToSell(): boolean {
    return Boolean(localStorage.getItem(LocalStorageEnum.SellerDepartment)
      && (localStorage.getItem(LocalStorageEnum.SellerPostalCode))
      && localStorage.getItem(LocalStorageEnum.SellerSellingGoal))
  }

  get sellerName() {
    return localStorage.getItem(LocalStorageEnum.SellerName);
  }

  get userPlatform() {
    return this.platform.platforms();
  }

  ionViewDidLeave() {
    this.destroyer$.next(true);
    this.destroyer$.complete();

    this.routeSubscribe$?.unsubscribe();
  }

  ionViewWillEnter() {
    if (this.platform.is('ios') || this.platform.is('desktop') || this.platform.is('mobileweb')) {
      this.isIos = true;
    } else {
      this.isIos = false;
    }

    if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
      this.noPOS = true;
    } else {
      this.noPOS = false;
    }

    this.sellerSellingGoal = this.volunteerShiftService.getSellerSellingGoal();
    this.buyForm = this.buildBuyForm();
    this.addressForm = this.builAddressForm();
    this.sellerLoginForm = this.buildSellerLoginForm();

    this.backButtonBlock.goBackSellingPage.pipe(takeUntil(this.destroyer$)).subscribe(() => {
      this.cancelBuy();
    })

    // this.destroyer$?.unsubscribe();
    // this.destroyer$?.complete();
    this.routeSubscribe$ = this.activatedRoute.queryParams.pipe(takeUntil(this.destroyer$)).subscribe((queryParams) => {
      this.status = queryParams['status'] || this.activatedRoute.snapshot.queryParamMap.get('status');
      this.message = queryParams['message'] || this.activatedRoute.snapshot.queryParamMap.get('message');
      this.action = queryParams['action'] || this.activatedRoute.snapshot.queryParamMap.get('action');
      this.transactionId = queryParams['transactionId'] || this.activatedRoute.snapshot.queryParamMap.get('transactionId');
      this.t = queryParams['t'] || this.activatedRoute.snapshot.queryParamMap.get('t') || null;
      this.routerUrl = this.router.url;

      if (this.status && this.hasEveryInfoToSell && this.action == 'activatePos') {
        if (this.status == 'success' || this.message == 'POS_IS_ALREADY_ACTIVATED') {
          // If we see ticket in the "basket", we show the client detail form
          if (this.totalAmount > 0) {
            this.showClientDetailForm = true;
            this.backButtonBlock.addBlockRef(SellingPage.name);
            this.clientWantNewsletter = false;
            this.clientAcceptData = false;
          }
          // this.vivaWalletConnectSuccess();
        } else {
          this.vivaWalletError();
        }
      }

      else if (this.status && this.hasEveryInfoToSell && this.action == 'sale') {
        if (this.status == 'success' && this.transactionId) {
          this.finalBuy();
        } else {
          this.vivaWalletError();
        }
      }

      else if (this.t && localStorage.getItem(LocalStorageEnum.SellingTmp)) {
        this.transactionId = this.t;
        this.finalBuy();
      }
    });

    if (this.hasEveryInfoToSell) {
      this.loadTicketType();
    }

    if (this.isLogin && !this.hasEveryInfoToSell) {
      this.openSellerDepartmentInfo();
    }

    this.verifySellerData();
  }

  // TODO for IOS
  buy() {
    if (!this.disabledBuyButton) {
      this.clientTransactionId = `${localStorage.getItem(LocalStorageEnum.SellerEmail)}-${new Date().getTime()}`;

      // TODO type that
      localStorage.setItem(LocalStorageEnum.SellingTmp, JSON.stringify({
        recapSelectedTicket: this.recapSelectedTicket,
        email: this.buyForm.value.email,
        firstname: this.buyForm.value.firstname,
        lastname: this.buyForm.value.lastname,
        askSendTicket: this.buyForm.value.askSendTicket,
        clientTransactionId: this.clientTransactionId,
        addressForm: this.addressForm.value,
      }));
      const tmpSellingJson = JSON.parse(localStorage.getItem(LocalStorageEnum.SellingTmp));

      this.sellingService.ticketsPrepar(
        tmpSellingJson.recapSelectedTicket,
        tmpSellingJson.email,
        tmpSellingJson.firstname,
        tmpSellingJson.lastname,
        tmpSellingJson.clientTransactionId,
      ).subscribe(() => {
        if (this.isIos) {
          this.openVivaWalletWebPaiement();
        } else {
          window.open(
            'vivapayclient://pay/v1' +
            `?appId=be.manifiesta${this.isIos ? 'pp' : ''}.app` +
            '&action=sale' +
            `&amount=${Math.floor(this.totalAmount * 100)}` +
            `&clientTransactionId=${this.clientTransactionId}` +
            '&callback=mycallbackscheme://selling',
            '_system'
          );
        }
      });
    } else {
      // TODO show message error
    }
  }

  async openVivaWalletWebPaiement() {
    console.log('hello to web paiement', this.totalAmount, this.totalAmount * 100, Math.floor(this.totalAmount * 100))
    this.sellingService.getSellerQrCode({
      amount: Math.floor(this.totalAmount * 100),
      merchantTrns: this.clientTransactionId,
    }).subscribe(async order => {
      console.log('ooooooooorder', order)
      // const vwWebUrl = `https://www.vivapayments.com/web2?ref=${order.orderCode}&paymentmethod=27`;
      const vwWebUrl = `https://www.vivapayments.com/web/checkout?ref=${order.orderCode}&paymentmethod=27&color=EF4135`;
      console.log('we go to', vwWebUrl)
      window.open(vwWebUrl, '_self');
    });
  }

  finalBuy() {
    this.showClientDetailForm = false;
    this.backButtonBlock.removeBlockRef(SellingPage.name);

    if (this.clientWantNewsletter) {
      this.addClientToNewsletter();
    }

    const tmpSellingJson = JSON.parse(localStorage.getItem(LocalStorageEnum.SellingTmp));

    this.loadingCommunication.changeLoaderTo(true);
    this.sellingService.ticketsSale(
      tmpSellingJson.recapSelectedTicket,
      tmpSellingJson.email,
      tmpSellingJson.firstname,
      tmpSellingJson.lastname,
      this.transactionId,
      tmpSellingJson.askSendTicket,
      tmpSellingJson.clientTransactionId,
      tmpSellingJson.addressForm,
    ).pipe(takeUntil(this.destroyer$)).subscribe(data => {
      this.finishSellingInfo = data;
      this.loadThermometer(true);
      this.succeedPaiement();
      // Put at zero the tickets sell amount / number
      this.ticketNumberOfSell = this.ticketTypes.map(t => { return { ticketId: t.id, ticketAmount: 0, ticketPrice: t.price + t.fee } });
      this.transactionId = undefined;
      this.clientTransactionId = undefined;
      this.clientWantNewsletter = false;
      this.clientAcceptData = false;
      localStorage.removeItem(LocalStorageEnum.SellingTmp);
    }).add(() => { this.loadingCommunication.changeLoaderTo(false); });
  }


  // also delete all the query param of the route
  async succeedPaiement() {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {},
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

    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {},
      });
  }

  buildBuyForm() {
    return this.formBuilder.group({
      email: [environment.dataMock ? 'samy.gnu@mymanifiesta.be' : '', [Validators.required, Validators.email, this.emailValidator()]],
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

  buildSellerLoginForm() {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, this.emailValidator()]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
    });
  }

  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const regex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return !regex.test(control.value.trim().toLowerCase()) ? { wrongEmailPath: { value: control.value } } : null;
    };
  }

  clickOnLogin() {
    localStorage.setItem(LocalStorageEnum.SellerEmail, this.sellerLoginForm.value.email);
    localStorage.setItem(
      LocalStorageEnum.SellerName,
      `${this.sellerLoginForm.value.firstname.trim()} ${this.sellerLoginForm.value.lastname.trim()}`
    );
    this.verifySellerData();

    this.openSellerDepartmentInfo();
  }

  clickOnLogout() {
    localStorage.removeItem(LocalStorageEnum.SellerEmail);
    localStorage.removeItem(LocalStorageEnum.SellerName);

    localStorage.removeItem(LocalStorageEnum.SellerDepartment);
    localStorage.removeItem(LocalStorageEnum.SellerPostalCode);
    localStorage.removeItem(LocalStorageEnum.SellerFromWorkGroup);
    localStorage.removeItem(LocalStorageEnum.SellerSellingGoal);
    this.verifySellerData();
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
    }).add(() => { this.loadingCommunication.changeLoaderTo(false); });
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
    if (this.hasEveryInfoToSell) {
      this.loadingCommunication.changeLoaderTo(true);
      this.sellingService.getAllTicketTypes().subscribe(tt => {
        this.ticketTypes = tt;
        this.ticketNumberOfSell = this.ticketTypes.map(t => { return { ticketId: t.id, ticketAmount: 0, ticketPrice: t.price + t.fee } });
      }).add(() => {
        this.loadingCommunication.changeLoaderTo(false);
      });
    }
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

  // TODO for IOS
  autoVivaWalletAuth() {
    window.open(
      'vivapayclient://pay/v1' +
      `?appId=be.manifiesta${this.isIos ? 'pp' : ''}.app` +
      `&apikey=${environment.vwAccessSite}` +
      `&apiSecret=${environment.vwAccessCode}` +
      `&pinCode=${environment.vwPinCode}` +
      '&action=activatePos' +
      '&disableManualAmountEntry=true' +
      '&activateQRCodes=true' +
      '&lockRefund=true' +
      '&lockTransactionsList=true' +
      '&lockMoto=true' +
      '&skipExternalDeviceSetup=true' +
      '&callback=mycallbackscheme://selling',
    );
  }

  setOpenModal(isOpen: boolean) {
    // To be sur to renew the form
    this.buyForm = this.buildBuyForm();
    this.addressForm = this.builAddressForm();
    if (this.isIos) {
      this.showClientDetailForm = true;
    } else {
      this.autoVivaWalletAuth();
    }
  }

  cancelBuy() {
    this.showClientDetailForm = false;
    this.backButtonBlock.removeBlockRef(SellingPage.name);
    this.ticketNumberOfSell = this.ticketTypes.map(t => { return { ticketId: t.id, ticketAmount: 0, ticketPrice: t.price + t.fee } });
  }

  async openShowAfterSellingModal() {
    const modal = await this.modalController.create({
      component: SellingPostInfoModalComponent,
      componentProps: {
        totalAmountTicket: this.mySellingInfo?.totalAmountTicket,
        sellerSellingGoal: this.sellerSellingGoal,
        mySellingInfo: this.mySellingInfo,
        sellerSendingDataI18NParam: this.sellerSendingDataI18NParam,
        sellerNameI18NParam: this.sellerNameI18NParam,
        finishSellingInfo: this.finishSellingInfo
      }
    })
    modal.present();
  }

  async openSellerDepartmentInfo() {
    const modal = await this.modalController.create({
      component: SellerDepartmentInfoModalComponent,
      componentProps: {
      }
    })
    modal.present();
    modal.onDidDismiss().then(() => {
      this.loadTicketType();
      if (!this.hasEveryInfoToSell) {
        this.clickOnLogout();
      }
    });
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

  onSellerAcceptData(event) {
    if (event.detail?.checked) {
      this.sellerAcceptData = true;
    } else {
      this.sellerAcceptData = false;
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

  // Action about department / postcode

  verifySellerData() {
    this.sellerDepartement = localStorage.getItem(LocalStorageEnum.SellerDepartment);
    this.sellerPostalCode = localStorage.getItem(LocalStorageEnum.SellerPostalCode);
    this.sellerSellingGoal = parseInt(localStorage.getItem(LocalStorageEnum.SellerSellingGoal));
    this.volunteerShiftService.sendSellerVerificationEmit();
  }

}
