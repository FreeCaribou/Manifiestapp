import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IEvent } from 'src/app/shared/models/Event.interface';
import { EventDayEnum } from 'src/app/shared/models/EventDay.enum';
import { LoadingCommunicationService } from 'src/app/shared/services/communication/loading.communication.service';
import { ProgrammeService } from 'src/app/shared/services/data/programme/programme.service';

@Component({
  selector: 'app-subprogramme',
  templateUrl: './subprogramme.page.html',
})
export class SubprogrammePage {
  dayId: string;
  list: IEvent[];
  listToShow: IEvent[];
  day: EventDayEnum;

  locaties: any[];
  locatieSelected: any;
  // Type in the backend taxonomy
  categories: any[];
  categorieSelected: any;
  languages: any[];
  languageSelected: any;
  // Category in the backend taxonomy
  subcategories: any[];
  subcategorieSelected: any;
  search: string;
  // organizers: any[];
  // organizerSelected: any;

  showFilters = false;

  days: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private programmeService: ProgrammeService,
    public loadingCommunication: LoadingCommunicationService,
    private router: Router,
  ) { }

  ionViewWillEnter() {
    this.loadingCommunication.changeLoaderTo(true);
    this.programmeService.getEvents().subscribe(data => {
      data.forEach(d => {
        let day = d.field_occurrence?.field_day;
        if (!this.days.includes(day)) {
          this.days.push(day);
        }
      });

      if (!this.router.url.includes('subprogramme')) {
        this.router.navigate(['programme', 'subprogramme', 'day', this.days[0]]);
      }
    }).add(() => this.loadingCommunication.changeLoaderTo(false));
  }

  isTabSelected(d): boolean {
    return this.router.url.includes(d);
  }
}
