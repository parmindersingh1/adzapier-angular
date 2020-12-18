import { Component, OnInit } from '@angular/core';
import {CookieTrackingService} from '../../../_services/cookie-tracking.service';
import {OrganizationService} from '../../../_services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {moduleName} from '../../../_constant/module-name.constant';
import { GdprService } from 'src/app/_services/gdpr.service';

class FilterType {
  consentType = '';
  status = '';
  country = '';
}

class FilterTypeData {
  consent_type: any[];
  status: any[];
  country: any[];
}
@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-tracking.component.html',
  styleUrls: ['./cookie-tracking.component.scss']
})
export class CookieTrackingComponent implements OnInit {
  cookieConsents = [];
  private currentManagedOrgID: any;
  private currrentManagedPropID: any;
  totalCookieCount;
  private firstone: number;
  public filterTypes: FilterType = new FilterType();
  public filterTypesData: FilterTypeData = new FilterTypeData();
  eventRows;
  tLoading = true;
  pagelimit;
  constructor(private cookieConsentService: CookieTrackingService,
              private  orgservice: OrganizationService,
              private loading: NgxUiLoaderService,
              private gdprService: GdprService

  ) { }

  ngOnInit() {
    this.onGetPropsAndOrgId();
    this.onGetFilterData();
    console.log(
    //  this.gdprService.docodeTcString()
    )
  }

  onGetPropsAndOrgId() {
    this.orgservice.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.currentManagedOrgID = response.organization_id;
        this.currrentManagedPropID = response.property_id;
      } else {
        const orgDetails = this.orgservice.getCurrentOrgWithProperty();
        this.currentManagedOrgID = orgDetails.organization_id;
        this.currrentManagedPropID = orgDetails.property_id;
      }
    });
  }
  onGetCookieConsentData(event) {
    this.tLoading = true;
    this.eventRows = event.rows;
    if (event.first === 0) {
      this.firstone = 1;
    } else {
      this.firstone = (event.first / event.rows) + 1;
    }
    this.pagelimit = '?limit=' + this.eventRows + '&page=' + this.firstone;
    this.onGetFromServer();
  }

  onGetFromServer(){
    this.loading.start();
    const filter = '&consent-type=' + this.filterTypes.consentType + '&status=' + this.filterTypes.status + '&country=' + this.filterTypes.country;
    this.cookieConsentService.getConsent(this.currrentManagedPropID, this.pagelimit + filter, this.constructor.name, moduleName.cookieTrackingModule)
    .subscribe(res => {
      this.loading.stop();
      this.tLoading = false;
      if (res['status'] === 200) {
        this.cookieConsents = Object.values(res['response']['CookieConsent']);
        this.totalCookieCount = res['count'];
      }
    }, error => {
      this.loading.stop();
      this.tLoading = false;
    });
  }

  onGetFilterData(){
    this.loading.start();
    this.cookieConsentService.onGetFilter(this.currrentManagedPropID, this.constructor.name, moduleName.cookieTrackingModule)
    .subscribe((res: any) => {
      this.loading.stop();
      if (res['status'] === 200) {
        this.filterTypesData = res.response;
      }
    }, error => {
      this.loading.stop();
    });
  }

  onDecodeString(consent) {
    this.gdprService.setConsent(consent);
    // console.log(tcString, status);
  }
}
