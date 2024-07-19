import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapOptions, Layer } from 'leaflet';
import { IEvent } from 'src/app/shared/models/Event.interface';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { MapCommunicationService } from 'src/app/shared/services/communication/map.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';
import { Clipboard } from '@capacitor/clipboard';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
})
export class EventDetailPage {
  id: string;
  event: IEvent;
  defaultHref = '/programme';

  options: MapOptions;
  markers: Layer[];

  // for the internet connection
  connected = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private programmeService: ProgrammeService,
    public loadingCommunication: LoadingCommunicationService,
    private languageService: TranslateService,
    public toastController: ToastController,
  ) { }

  ionViewDidEnter() {
    this.loadingCommunication.changeLoaderTo(true);
    this.id = this.activatedRoute.snapshot.params.id;
    this.programmeService.getEvent(this.id).subscribe(data => {
      // TODO one day we will have a map here
      this.event = data;
    }).add(() => this.loadingCommunication.changeLoaderTo(false));

    // Network.getStatus().then(n => {
    //   this.connected = n.connected;
    //   if (this.connected) {
    //     this.loadingCommunication.changeLoaderTo(true);
    //     this.id = this.activatedRoute.snapshot.params.id;
    //     this.programmeService.getEvent(this.id).subscribe(data => {
    //       this.event = data;
    
    //       if (this.event.position) {
    //         this.options = this.mapCommunication.getOptionsMap(
    //           this.event.position.lat,
    //           this.event.position.lng
    //         );
    //         this.markers = [
    //           this.mapCommunication.createMarker(
    //             this.event.position.lat,
    //             this.event.position.lng,
    //             `${this.event.title} - ${this.event.description}`,
    //             this.event.id)
    //         ];
    //       }
    //     }).add(() => { this.loadingCommunication.changeLoaderTo(false); });
    
    //     this.programmeService.verificationFavoriteLoadEmit.subscribe(load => this.loadingCommunication.changeLoaderTo(load));
    //   }
    // });
  }

  onCardHeartClick(event: IEvent) {
    this.programmeService.changeFavorite(event);
  }

  copyToShare() {
    const link = `https://manifiesta.be/${this.languageService.currentLang}${this.event.path.current}`;
    Clipboard.write({string: link}).then(() => {
      this.toastController.create({
        message: link,
        icon: 'share-social-outline',
        color: 'success',
        position: 'top',
        duration: 2000,
        animated: true,
        translucent: true,
      }).then(toast => {
        toast.present();
      });
    });
  }

}
