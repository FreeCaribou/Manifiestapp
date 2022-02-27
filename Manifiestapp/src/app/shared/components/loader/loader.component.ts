import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnChanges {
  @Input()
  show;

  loader;
  constructor(
    public loadingController: LoadingController
  ) { }

  async ngOnChanges(change) {
    if (change.show) {
      // await this.haveShowChange(change.show.currentValue);
    }
  }

  async haveShowChange(value) {
    console.log('ask have show change', value, this.loader)
    // if (!this.loader) {
    //   await this.createLoading();
    // }
    if (!value && this.loader) {
      console.log('dismiss')
      await this.loader.dismiss();
    }
    if (value) {
      console.log('show')
      await this.createLoading();
      await this.loader.present();
    }
  }

  async createLoading() {
    this.loader = await this.loadingController.create({
      spinner: 'circles',
      cssClass: 'loader'
    });
  }

}
