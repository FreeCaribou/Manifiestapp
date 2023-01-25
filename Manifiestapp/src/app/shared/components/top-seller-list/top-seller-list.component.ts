import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-seller-list',
  templateUrl: './top-seller-list.component.html',
})
export class TopSellerListComponent {
  @Input()
  list: any[];

  @Input()
  total: number;

  constructor() {
  }

}
