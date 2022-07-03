import { Component, Input } from '@angular/core';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input()
  title: string;
  @Input()
  defaultHref: string;
  @Input()
  withoutI18n = false;

  connected = true;

  constructor() {
    Network.getStatus().then(n => {
      this.connected = n.connected;
    });
   }

}
