import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit, OnChanges {
  @Input()
  show;

  loader;
  constructor(
    public loadingController: LoadingController
  ) { }

  ngOnInit() {

  }

  ngOnChanges(change) {
    if (change.show) {
      this.haveShowChange(change.show.currentValue);
    }
  }

  async haveShowChange(value) {
    if (!this.loader) {
      await this.createLoading();
    }
    if (!value) {
      await this.loader.dismiss();
    }
    if (value) {
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
