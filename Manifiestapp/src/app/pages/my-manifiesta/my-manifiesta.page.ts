import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalNotifications } from '@capacitor/local-notifications';
import { MenuController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SelectLangComponent } from 'src/app/shared/components/select-lang/select-lang.component';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { LanguageCommunicationService } from 'src/app/shared/services/communication/language.communication.service';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';
import { VolunteerShiftService } from 'src/app/shared/services/data/volunteer-shift/volunteer-shift.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-manifiesta',
  templateUrl: './my-manifiesta.page.html',
  styleUrls: ['./my-manifiesta.page.scss'],
})
export class MyManifiestaPage implements OnDestroy {
  list: EventInterface[];
  favorieChangeEmit: Subscription;
  dateJustWithHour = false;
  haveConflict = false;
  shifts = [];
  loginForm: FormGroup;
  isConnected = false;

  constructor(
    private programmeService: ProgrammeService,
    public languageCommunication: LanguageCommunicationService,
    public loadingCommunication: LoadingCommunicationService,
    public router: Router,
    public menu: MenuController,
    public modalController: ModalController,
    private volunteerShiftService: VolunteerShiftService,
    private formBuilder: FormBuilder
  ) { }

  ionViewWillEnter() {
    this.isConnected = this.volunteerShiftService.isConnectedToBeeple();
    this.loginForm = this.buildLoginForm();
    this.favorieChangeEmit = this.programmeService.favoriteChangeEmit.subscribe(() => this.fetchFavoriteProgramme());
    this.fetchFavoriteProgramme();
    this.fetchShifts();
  }

  fetchShifts() {
    if (this.volunteerShiftService.isConnectedToBeeple()) {
      this.loadingCommunication.changeLoaderTo(true);
      this.volunteerShiftService.getShifts().subscribe(d => {
        // TODO manage error, also with backend
        if (d.error) {

        } else {
          this.shifts = d;
        }
      }).add(() => { this.loadingCommunication.changeLoaderTo(false); })
    }
  }

  fetchFavoriteProgramme() {
    this.loadingCommunication.changeLoaderTo(true);
    this.programmeService.getFavoriteProgramme().subscribe(data => {
      this.list = data;
      this.haveConflict = this.list.findIndex(e => e.inFavoriteConflict) > -1;
      this.loadingCommunication.changeLoaderTo(false);
    });
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
      email: [environment.dataMock ? 'samy.gnu@manifiestapp.be' : '', [Validators.required]],
      password: [environment.dataMock ? 'babyDontHurtMeNoMore' : '', Validators.required],
    });
  }

  clickOnLogin() {
    this.loadingCommunication.changeLoaderTo(true)
    this.volunteerShiftService.login(this.loginForm.value).subscribe(user => {
      this.isConnected = this.volunteerShiftService.isConnectedToBeeple();
      this.fetchShifts();
    }).add(() => {this.loadingCommunication.changeLoaderTo(false)})
  }

  clickOnLogout() {
    this.volunteerShiftService.logout();
    this.shifts = [];
    this.isConnected = this.volunteerShiftService.isConnectedToBeeple();
  }

  ngOnDestroy() {
    if (this.favorieChangeEmit) {
      this.favorieChangeEmit.unsubscribe();
    }
  }

}
