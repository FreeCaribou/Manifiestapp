import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-marker-popup',
  template: '<p> Helloooo {{ message }} </p>',
})
export class MarkerPopupComponent implements OnInit {

  @Input() message = 'Default Pop-up Message.';

  constructor() { }

  ngOnInit() {
  }


}