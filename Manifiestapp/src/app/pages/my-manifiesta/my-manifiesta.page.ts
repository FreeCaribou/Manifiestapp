import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalNotifications } from '@capacitor/local-notifications';
import { MenuController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SelectLangComponent } from 'src/app/shared/components/select-lang/select-lang.component';
import { EventInterface } from 'src/app/shared/models/Event.interface';
import { LanguageCommunicationService } from 'src/app/shared/services/communication/language.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-my-manifiesta',
  templateUrl: './my-manifiesta.page.html',
  styleUrls: ['./my-manifiesta.page.scss'],
})
export class MyManifiestaPage implements OnDestroy {
  list: EventInterface[] = [];

  favorieChangeEmit: Subscription;

  isLoading = true;

  dateJustWithHour = false;

  haveConflict = false;

  constructor(
    private programmeService: ProgrammeService,
    public languageCommunication: LanguageCommunicationService,
    public router: Router,
    public menu: MenuController,
    public modalController: ModalController
  ) { }

  ionViewWillEnter() {
    this.isLoading = true;
    this.favorieChangeEmit = this.programmeService.favoriteChangeEmit.subscribe(() => this.fetchData())
    this.fetchData();
  }

  fetchData() {
    this.programmeService.getFavoriteProgramme().subscribe(data => {
   
      this.list = data;
      this.haveConflict = this.list.findIndex(e => e.inFavoriteConflict) > -1;
      this.isLoading = false;
      console.log('data', data, this.isLoading)
    });
  }

  onCardHeartClick(event: EventInterface) {
    this.programmeService.changeFavorite(event);
  }

  ionViewWillLeave() {
    this.list = [];
  }

  async languageSegmentChanged(event) {
    console.log('eee', event)
    // this.languageCommunication.changeLanguage(event.detail.value);

    await this.presentModalSelectLang(event.detail.value);
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
