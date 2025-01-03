import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tickets-types-count',
  templateUrl: './tickets-types-count.component.html',
})
export class TicketsTypesCountComponent implements OnInit {

  @Input()
  details: any[] = [];

  ticketsTypes: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.ticketsTypes = [];
    this.details.forEach(d => {
      d.ticketInfo.forEach((ti: { ticketId: any; ticketAmount: any; }) => {
        const index = this.ticketsTypes.findIndex(tt => tt.ticketId === ti.ticketId);
        if (index > -1) {
          this.ticketsTypes[index].ticketAmount += ti.ticketAmount;
        } else {
          this.ticketsTypes.push({ ...ti });
        }
      });
    });
  }

}
