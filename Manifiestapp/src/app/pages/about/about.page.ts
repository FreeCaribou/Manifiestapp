import { Component, OnInit } from '@angular/core';
import { VolunteerShiftService } from 'src/app/shared/services/data/volunteer-shift/volunteer-shift.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
})
export class AboutPage {

  longTextInfos = '';

  constructor(private volunteerShiftService: VolunteerShiftService) { }
  
  ionViewDidEnter() {
    this.volunteerShiftService.getLongtextOveralInfos().subscribe(ni => {
      this.longTextInfos = ni.text;
    });
  }

}
