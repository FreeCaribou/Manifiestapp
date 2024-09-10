import { Component, Inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { LongtextService } from 'src/app/shared/services/api/longtext.service';
import { SellersService } from 'src/app/shared/services/api/sellers.service';
import { ExcelService } from 'src/app/shared/services/communication/excel.service';

@Component({
  selector: 'app-page-volunteer',
  templateUrl: './page-volunteer.component.html',
})
export class PageLongTextComponent implements OnInit {

  volunteerFr: string = '';
  volunteerNl: string = '';
  newInfosFr: string = '';
  newInfosNl: string = '';
  overInfoFr: string = '';
  overInfoNl: string = '';
  homeFr: string = '';
  homeNl: string = '';

  tinyMceConfig = {
    base_url: '/tinymce',
    suffix: '.min'
  };

  volunteersBenefits = 'volunteers-benefits';
  generalNewInfos = 'general-new-infos';
  overInfos = 'over-info';
  home = 'home';

  constructor(
    private longtextService: LongtextService,
    private sellersService: SellersService,
    private excelService: ExcelService,
  ) { }

  ngOnInit(): void {
    forkJoin([
      this.longtextService.getOneLongtext(this.volunteersBenefits, 'fr'),
      this.longtextService.getOneLongtext(this.volunteersBenefits, 'nl'),
      this.longtextService.getOneLongtext(this.generalNewInfos, 'fr'),
      this.longtextService.getOneLongtext(this.generalNewInfos, 'nl'),
      this.longtextService.getOneLongtext(this.overInfos, 'fr'),
      this.longtextService.getOneLongtext(this.overInfos, 'nl'),
      this.longtextService.getOneLongtext(this.home, 'fr'),
      this.longtextService.getOneLongtext(this.home, 'nl'),
    ]).subscribe(([vbFr, vbNl, niFr, niNl, oiFr, oiNl, hFr, hNl]) => {
      this.volunteerFr = vbFr?.text;
      this.volunteerNl = vbNl?.text;
      this.newInfosFr = niFr?.text;
      this.newInfosNl = niNl?.text;
      this.overInfoFr = oiFr?.text;
      this.overInfoNl = oiNl?.text;
      this.homeFr = hFr?.text;
      this.homeNl = hNl?.text;
    });
  }

  saveVbFr() {
    this.saveGlobal(this.volunteersBenefits, 'fr', this.volunteerFr);
  }

  saveVbNl() {
    this.saveGlobal(this.volunteersBenefits, 'nl', this.volunteerNl);
  }

  saveNiFr() {
    this.saveGlobal(this.generalNewInfos, 'fr', this.newInfosFr);
  }

  saveNiNl() {
    this.saveGlobal(this.generalNewInfos, 'nl', this.newInfosNl);
  }

  saveOiFr() {
    this.saveGlobal(this.overInfos, 'fr', this.overInfoFr);
  }

  saveOiNl() {
    this.saveGlobal(this.overInfos, 'nl', this.overInfoNl);
  }

  saveHomeFr() {
    this.saveGlobal(this.home, 'fr', this.homeFr);
  }

  saveHomeNl() {
    this.saveGlobal(this.home, 'nl', this.homeNl);
  }

  saveGlobal(label: string, lang: string, text: string) {
    this.longtextService.editOneLongText({
      label,
      lang,
      text,
    }).subscribe(() => {
      console.log('good edit')
    });
  }

  getBeepleFunctions() {
    this.sellersService.beepleFunctions().subscribe(data => {
      this.excelService.exportAsExcelFile(data.functions.map((d: any) => {
        return {
          id: d.id,
          name: d.name,
          name_fr: d.name_i18n?.fr,
          name_nl: d.name_i18n?.nl,
          description: d.description,
          description_fr: d.description_i18n?.fr,
          description_nl: d.description_i18n?.nl,
        }
      }), 'beeple-function')
    });
  }

}

