import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-details-tickets',
  templateUrl: './details-tickets.component.html',
})
export class DetailsTicketsComponent implements OnInit {

  @Input()
  tickets: any[] = [];

  constructor() { }

  ngOnInit(): void {
    
  }

}
