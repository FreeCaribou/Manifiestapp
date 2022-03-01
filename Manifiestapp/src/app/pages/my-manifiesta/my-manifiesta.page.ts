import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalNotifications } from '@capacitor/local-notifications';
import { MenuController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SelectLangComponent } from 'src/app/shared/components/select-lang/select-lang.component';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { LanguageCommunicationService } from 'src/app/shared/services/communication/language.communication.service';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

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

  constructor(
    private programmeService: ProgrammeService,
    public languageCommunication: LanguageCommunicationService,
    public loadingCommunication: LoadingCommunicationService,
    public router: Router,
    public menu: MenuController,
    public modalController: ModalController
  ) { }

  ionViewWillEnter() {
    this.favorieChangeEmit = this.programmeService.favoriteChangeEmit.subscribe(() => this.fetchData())
    this.fetchData();
  }

  fetchData() {
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

  ngOnDestroy() {
    if (this.favorieChangeEmit) {
      this.favorieChangeEmit.unsubscribe();
    }
  }

}
