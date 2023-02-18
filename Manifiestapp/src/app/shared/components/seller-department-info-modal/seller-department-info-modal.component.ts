import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LocalStorageEnum } from '../../models/LocalStorage.enum';
import { LoadingCommunicationService } from '../../services/communication/loading.communication.service';
import { SellingService } from '../../services/data/selling/selling.service';

// TODO go to real form
@Component({
  selector: 'app-seller-department-info-modal',
  templateUrl: './seller-department-info-modal.component.html',
})
export class SellerDepartmentInfoModalComponent implements OnInit {

  departements = [];
  provinces = [];

  sellerDepartement: string;
  sellerPostalCode: string;
  sellerSellingGoal: number;
  sellerFromWorkGroup: string;

  constructor(
    public modalController: ModalController,
    private router: Router,
    private sellingService: SellingService,
    public loadingCommunication: LoadingCommunicationService,
  ) {
  }

  get infoOk() {
    return this.sellerDepartement && this.sellerPostalCode && this.sellerSellingGoal;
  }

  ngOnInit(): void {
    this.loadingCommunication.changeLoaderTo(true);
    forkJoin([
      this.sellingService.getAllDepartments(),
      this.sellingService.getAllProvinceInfo()
    ]).subscribe(d => {
      this.departements = d[0];
      this.provinces = d[1];

      this.verifyData();
    }).add(() => { this.loadingCommunication.changeLoaderTo(false); });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(r => {
      this.closeShowAfterSellingModal();
    });
  }

  verifyData() {
    this.sellerDepartement = localStorage.getItem(LocalStorageEnum.SellerDepartment);
    this.sellerPostalCode = localStorage.getItem(LocalStorageEnum.SellerPostalCode);
    this.sellerSellingGoal = parseInt(localStorage.getItem(LocalStorageEnum.SellerSellingGoal));
    this.sellerFromWorkGroup = localStorage.getItem(LocalStorageEnum.SellerFromWorkGroup);
  }

  ok() {
    localStorage.setItem(LocalStorageEnum.SellerSellingGoal, this.sellerSellingGoal.toString());
    localStorage.setItem(LocalStorageEnum.SellerDepartment, this.sellerDepartement);
    localStorage.setItem(LocalStorageEnum.SellerPostalCode, this.sellerPostalCode);
    if (this.sellerFromWorkGroup) {
      localStorage.setItem(LocalStorageEnum.SellerFromWorkGroup, 'true');
    } else {
      localStorage.removeItem(LocalStorageEnum.SellerFromWorkGroup);
    }

    this.modalController?.dismiss();
  }

  async closeShowAfterSellingModal() {
    const modal = await this.modalController.getTop();
    if (modal) {
      this.modalController?.dismiss();
    }
  }

  // TODO verification real post code of check with the department
  onSellerDepartementChange(event) {
    if (event.detail?.value) {
      this.sellerDepartement = event.detail?.value;
      if (event.detail?.value !== 'BASE') {
        this.sellerFromWorkGroup = undefined;
      }
    } else {
      this.sellerDepartement = undefined;
    }
  }

  onSellerPostalCodeChange(event) {
    const postalCode = event.detail?.value;
    if (!!postalCode) {
      const province = this.provinces.find(p => {
        return p.ranges?.find(r => {
          return r.start <= postalCode && r.end >= postalCode
        })
      });
      if (province) {
        this.sellerPostalCode = postalCode;
      } else {
        this.sellerPostalCode = undefined;
      }
    } else {
      this.sellerPostalCode = undefined;
    }
  }

  onSellerFromWorkGroup(event) {
    if (event.detail?.checked) {
      this.sellerFromWorkGroup = 'true';
    } else {
      this.sellerFromWorkGroup = undefined;
    }
  }

  onSellerSellingGoal(event) {
    const sellingGoal = event.detail?.value;
    if (isNaN(sellingGoal)) {
      this.sellerSellingGoal = undefined;
    } else {
      if (!!sellingGoal) {
        this.sellerSellingGoal = sellingGoal;
      } else {
        this.sellerSellingGoal = undefined;
      }
    }
  }

}
