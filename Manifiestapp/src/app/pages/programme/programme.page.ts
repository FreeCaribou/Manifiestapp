import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InfoListService } from 'src/app/shared/services/data/info-list/info-list.service';

@Component({
  selector: 'app-programme',
  templateUrl: './programme.page.html',
  styleUrls: ['./programme.page.scss'],
})
export class ProgrammePage implements OnInit {
  days: any[];

  constructor(
    private infoListService: InfoListService,
    private router: Router
  ) { }

  ngOnInit() {
    this.infoListService.getDays().subscribe(data => {
      this.days = data;
      console.log('hello dags?', data, data[0].id, this.router.url)
      if (!this.router.url.includes('subprogramme')) {
        this.router.navigate(['programme', 'subprogramme', data[0].id]);
      }
    });
  }

  isTabSelected(d): boolean {
    return this.router.url.includes(d.id);
  }

}
