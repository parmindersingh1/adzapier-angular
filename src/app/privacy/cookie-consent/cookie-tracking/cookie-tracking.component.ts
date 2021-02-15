import {Component, OnInit} from '@angular/core';
import {CookieTrackingService} from '../../../_services/cookie-tracking.service';
import {OrganizationService} from '../../../_services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {moduleName} from '../../../_constant/module-name.constant';
import {GdprService} from 'src/app/_services/gdpr.service';
import * as moment from 'moment';
import {featuresName} from '../../../_constant/features-name.constant';
import {DataService} from '../../../_services/data.service';

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
  startDate: any;
  endDate: any;
  private firstone: number;
  public filterTypes: FilterType = new FilterType();
  public filterTypesData: FilterTypeData = new FilterTypeData();
  eventRows;
  tLoading = true;
  pagelimit;
  planDetails: any;
  isDisabledScreen = false;

  constructor(private cookieConsentService: CookieTrackingService,
              private  orgservice: OrganizationService,
              private loading: NgxUiLoaderService,
              private gdprService: GdprService,
              private dataService: DataService
  ) {
  }

  ngOnInit() {
    this.onGetPropsAndOrgId();
    this.onGetFilterData();
    this.onSetUpDate();
    this.onCheckSubscription();
  }

  onCheckSubscription() {
    this.planDetails = this.dataService.getCurrentPropertyPlanDetails();
    const isAllowViewConsent = this.dataService.isAllowCookieTracking(this.planDetails.response, featuresName.FULL_CONVERSION_AND_VISITOR, featuresName.CONSENT_RECORD_KEEPING);
    this.isDisabledScreen = !isAllowViewConsent;
    if (!isAllowViewConsent) {
      this.dataService.openUpgradeModalForCookieConsent(this.planDetails);
    }
  }

  onSetUpDate() {
    const that = this;
    const start = moment().subtract(29, 'days');
    const end = moment();

    function cb(start, end) {
      jQuery('#reportrange').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      that.startDate = start.format('YYYY-MM-DD');
      that.endDate = end.format('YYYY-MM-DD');
      that.onGetFromServer();
    }

    (<any>$('#reportrange')).daterangepicker({
      startDate: start,
      endDate: end,
      maxDate: new Date(),
      ranges: {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        'This Year': [moment().startOf('year'), moment().endOf('year')],
        'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
      }
    }, cb);
    cb(start, end);
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

  onGetFromServer() {
    this.loading.start();
    const filter = '&consent_type=' + this.filterTypes.consentType + '&status=' + this.filterTypes.status + '&country=' + this.filterTypes.country
      + '&startDate=' + this.startDate + '&endDate=' + this.endDate;
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

  onGetFilterData() {
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

  openDisablePopUp() {
    if (this.isDisabledScreen) {
      this.dataService.openUpgradeModalForCookieConsent(this.planDetails)
    }
  }
}
