import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-thermometer',
  templateUrl: './thermometer.component.html',
  styleUrls: ['./thermometer.component.scss']
})
export class ThermometerComponent {
  @Input()
  totalAmountTicket: number;
  @Input()
  sellerSellingGoal: number

  progress = 0;

  constructor() {
    this.progress = 0;
    setInterval(() => {
      if (this.progress < (this.totalAmountTicket / this.sellerSellingGoal)) {
        this.progress += 0.025;
      }
    }, 50);
  }

}
