import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InfoListService } from 'src/app/shared/services/data/info-list/info-list.service';

@Component({
  selector: 'app-programme',
  templateUrl: './programme.page.html',
  styleUrls: ['./programme.page.scss'],
})
export class ProgrammePage {
  days: any[];

  isLoading = true;

  constructor(
    private infoListService: InfoListService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.isLoading = true;
    this.infoListService.getDays().subscribe(data => {
      // The data from WP don't come always in right order for the days
      // We look for the slug, kind of WP id
      // Slug will be day-<number of the day event>-lang(nl||fr)
      this.days = data.sort((a, b) => {
        return a.slug < b.slug ? -1 : 1;
      });
      if (!this.router.url.includes('subprogramme')) {
        this.router.navigate(['programme', 'subprogramme', data[0].id]);
      }
      this.isLoading = false;
    });
  }

  ionViewWillLeave() {
    this.days = [];
  }

  isTabSelected(d): boolean {
    return this.router.url.includes(d.id);
  }

}
