import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {GdprService} from '../../../../_services/gdpr.service';

@Component({
  selector: 'app-az-preference',
  templateUrl: './az-preference.component.html',
  styleUrls: ['./az-preference.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AzPreferenceComponent implements OnInit {
  @Input('formData') formData;
  @Input('purposesList') purposesList;
  showPreferenceType = 'ccpa';
  currentPurposeID = 0;
  gdprPurposeList = [];
  iabVendorsList = [];
  preferenceStep = 1;

  constructor(private gdprService: GdprService) {
  }

  async ngOnInit() {
    await this.getGdprPurposes();
  }

  onShowDesc(id) {
    this.currentPurposeID = this.currentPurposeID === id ? 0 : id;
  }

  async getGdprPurposes() {
    const allGdprContent = await this.gdprService.getAllData();
    this.gdprPurposeList = Object.values(allGdprContent.purposes);
    this.iabVendorsList = Object.values(allGdprContent.vendors).slice(0, 20);
  }
}
