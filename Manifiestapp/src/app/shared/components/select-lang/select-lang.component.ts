import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-lang',
  templateUrl: './select-lang.component.html',
})
export class SelectLangComponent {

  constructor(public modalController: ModalController) { }

  select(change) {
    this.modalController.dismiss({
      'change': change
    });
  }

}