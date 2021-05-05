import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from '../../_services/dashboard.service';
import { OrganizationService} from '../../_services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {moduleName} from '../../_constant/module-name.constant';
import {DataService} from '../../_services/data.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Location} from '@angular/common';
interface Country {
  count: number;
  state: string;
}

declare var jQuery: any;
class CookieCount {
  totalConsent = 0;
  acceptAll = 0;
  saveSetting = 0;
  rejectAll = 0;
  close = 0;
  doNotSale = 0;
}
class Opt {
  allow_advertising: 0;
  allow_analytics: 0;
  allow_essantial: 0;
  allow_socialmedia: 0;
  allow_functional: 0;
  allow_unknown: 0;
  total_consents: 0;
}
@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent implements OnInit {
  currentManagedOrgID: any;
  alertMsg: any;
  alertType: any;
  loadingSkeleton = {
    one: false,
    two: false,
    three: false,
    four: false,
    five: false
  };
  dismissible = true;
  isOpen = false;
  countryList = [];
  currrentManagedPropID: any;
  dashboardCount: CookieCount = new CookieCount();
  optIn = new Opt();
  optOut = new Opt();
  consentDetails = [];
  percentDashboardCount: CookieCount = new CookieCount();
   currentCountry: any;
   currentCountryMap = 'us';
   stateCountryColor = {};
  stateList: Country[] = [];
  private countryColor: any;
  isShowDashboard = false;
  @ViewChild('noSup', {static: true}) noSup;
  modalRef: BsModalRef;
  constructor(private dashboardService: DashboardService,
              private orgservice: OrganizationService,
              private cd: ChangeDetectorRef,
              private loading: NgxUiLoaderService,
              private dataService: DataService,
              private modalService: BsModalService,
              private _location: Location
  ) { }

  ngOnInit() {
    this.onGetPropsAndOrgId();
    this.onGetDashboardData();
    this.onGetOptInActivity();
    this.onGetOptOutActivity();
    this.onGetCountryList();
    this.onConsentDetails();
    this.onGetMapData();
    this.onCheckSubscription()
  }

  onCheckSubscription() {
    const resData: any = this.dataService.getCurrentPropertyPlanDetails();
    const features = resData.response.features;
    if (features == null) {
      this.isShowDashboard = false;
    } else {
      if( Object.keys(features).length > 0) {
        this.isShowDashboard = true;
      } else {
        this.isShowDashboard = false;
      }
    }
    this.onOpenPopUp();
  }

  onOpenPopUp() {
    if (!this.isShowDashboard) {
      this.modalRef = this.modalService.show(this.noSup, {class: 'modal-md', ignoreBackdropClick: true});
    }
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
  onGetDashboardData() {
    this.loading.start('1');
    this.loadingSkeleton.one = true;
    this.dashboardService.getDashboardData(this.currrentManagedPropID, this.constructor.name, moduleName.cookieConsentModule)
      .subscribe((res: any) => {
        this.loading.stop('1');
        this.loadingSkeleton.one = false;
        if (res) {
          if (res['status'] === 200) {
            const result = res['response'];
            // count
            this.dashboardCount.totalConsent = result.hasOwnProperty('total_consents') ? result['total_consents'] : 0;
            this.dashboardCount.acceptAll = result.hasOwnProperty('accept_all') ? result['accept_all'] : 0;
            this.dashboardCount.close = result.hasOwnProperty('close') ? result['close'] : 0;
            this.dashboardCount.rejectAll = result.hasOwnProperty('reject_all') ? result['reject_all'] : 0;
            this.dashboardCount.saveSetting = result.hasOwnProperty('save_setting') ? result['save_setting'] : 0;
            this.dashboardCount.doNotSale = result.hasOwnProperty('do_not_sell') ? result['do_not_sell'] : 0;

            // Calculate Count
            this.percentDashboardCount.acceptAll = result.hasOwnProperty('accept_all') ? this.onCalculateValue(result['accept_all']) : 0;
            this.percentDashboardCount.close = result.hasOwnProperty('close') ? this.onCalculateValue(result['close']) : 0;
            this.percentDashboardCount.rejectAll = result.hasOwnProperty('reject_all') ? this.onCalculateValue(result['reject_all']) : 0;
            this.percentDashboardCount.saveSetting = result.hasOwnProperty('save_setting') ? this.onCalculateValue(result['save_setting']) : 0;
            this.percentDashboardCount.doNotSale = result.hasOwnProperty('do_not_sell') ? this.onCalculateValue(result['do_not_sell']) : 0;
          }
        }
      }, error => {
        this.loading.stop('1');
        this.loadingSkeleton.one = false;
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
      });
  }

  onGetOptInActivity() {
    this.loading.start('f1');
    this.loadingSkeleton.two = true;
    this.dashboardService.getOtpInActivity(this.currrentManagedPropID, this.constructor.name, moduleName.cookieConsentModule)
      .subscribe(res => {
        this.loadingSkeleton.two = false;
        this.loading.stop('f1');
        if (res) {
          this.optIn = res['response'];
        }
      }, error => {
        this.loadingSkeleton.two = false;
        this.loading.stop('f1');
      })
  }

  onGetOptOutActivity() {
    this.loadingSkeleton.three = true;
    this.loading.start('f2');
    this.dashboardService.getOtpOutActivity(this.currrentManagedPropID, this.constructor.name, moduleName.cookieConsentModule)
      .subscribe((res: any) => {
        this.loadingSkeleton.three = false;
        this.loading.stop('f2');
        if (res) {
          this.optOut = res.response;
        }
      }, error => {
        this.loadingSkeleton.three = false;
        this.loading.stop('f2');
      });
  }


  onSelectCountry(event) {
    this.currentCountry = event.target.value;
    this.onConsentDetails();
  }
  onGetCountryList() {
  this.loading.start('f6');
  const params = null;
  this.dashboardService.getCookieConsentCountry(this.currrentManagedPropID, params, this.constructor.name, moduleName.cookieConsentModule)
    .subscribe((res: any) => {
      this.loading.stop('f6');
      if (res) {
        this.countryList = res.response;
        if (res.response.length > 0) {
          this.currentCountry = res.response[0].country;
          this.onConsentDetails();
        }
      }
    }, error => {
      this.loading.stop('f6');
    });
  }
  onConsentDetails() {
    this.loading.start('f3');
    this.loadingSkeleton.four = true;
    const params = {
      country:  this.currentCountry
    };
    this.dashboardService.getConsentDetails(this.currrentManagedPropID, params, this.constructor.name, moduleName.cookieConsentModule)
      .subscribe((res: any) => {
        this.loading.stop('f3');
        this.loadingSkeleton.four = false;
        if (res) {
          this.consentDetails = res.response;
        }
      }, error => {
        this.loadingSkeleton.four = false;
        this.loading.stop('f3');
      })
  }

  onCalculateValue(val1) {
    return Math.ceil(val1 * 100 / this.dashboardCount.totalConsent);
  }
  onCalculateOptValue(val, totalConsent) {
    const cal = Math.ceil(val * 100 / totalConsent);
    if (isNaN(cal)) {
      return 0;
    } else {
      return cal;
    }
  }

  onSelectCountryMap(e) {
    const country = e.target.value;
    this.currentCountryMap = country;
    setTimeout(() => {
      this.onGetMapData();
    }, 1000);
  }

  onGetMapData() {
    // this.loading.start('f7');
    const params = {
      // country: 'IN'
      country: this.currentCountryMap
    };
    this.loadingSkeleton.five = true;
    this.dashboardService.getMapDataForConsentDashboard(this.currrentManagedPropID, params, this.constructor.name, moduleName.cookieConsentModule)
      .subscribe( (res: any) => {
        this.loadingSkeleton.five = false;
        this.loading.stop('f7');
        const result = res.response;
        const resData = [...res.response];

        if (this.currentCountryMap === 'us') {
          for (const  countryData of result) {
            this.stateCountryColor[`${countryData.state.toLowerCase()}`] = '#69b2f8';
          }
          this.stateList = result;
          this.onInItStateMap();
        } else {
          this.countryColor = [];
          for (const  countryData of result) {
            this.countryColor[`${countryData.country.toLowerCase()}`] = '#69b2f8';
          }

          // this.countryList = resData;
          this.onInItWorldMap(resData);
        }

      }, error => {
        this.loadingSkeleton.five = false;
        this.loading.stop('f7');
      })
  }
  onInItStateMap() {
    const that = this;
    jQuery('#vmap').empty();
    jQuery('#vmap').vectorMap({
        map: 'usa_en',
        showTooltip: true,
        backgroundColor: '#fff',
        color: '#d1e6fa',
        colors: that.stateCountryColor,
        selectedColor: '#00cccc',
        enableZoom: false,
        borderWidth: 1,
        borderColor: '#fff',
        hoverOpacity: .85,
        onLabelShow:  (event, label, code) => {
          for (const  stateData of that.stateList) {
            if (code === stateData.state.toLowerCase()) {
              label.append(' : ' + stateData.count);
            } else {
              // label.append(' : 0');
            }
          }
          that.cd.detectChanges();
        }
      });
  }
  onInItWorldMap(resData) {
    const that = this
    jQuery('#worldMap').empty();
    jQuery('#worldMap').vectorMap({
      map: 'world_en',
      backgroundColor: '#fff',
      color: '#d1e6fa',
      colors: that.countryColor,
      hoverOpacity: 0.7,
      selectedColor: '#00cccc',
      enableZoom: true,
      showTooltip: true,
      scaleColors: ['#d1e6fa', '#00cccc'],
      normalizeFunction: 'polynomial',
      onLabelShow:  (event, label, code) => {
        for (const  countryData of resData) {
          if (code === countryData.country.toLowerCase()) {

            label.append(' : ' + countryData.count);
          } else {
            // label.append(' : 0');
          }
        }
        that.cd.detectChanges();
      }
    });
  }
  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  onRefreshAll() {
    this.onGetDashboardData();
    this.onGetOptInActivity();
    this.onGetOptOutActivity();
    this.onGetCountryList();
    this.onConsentDetails();
    this.onGetMapData();
  }
  onGoBack() {
    this.modalRef.hide();
    this._location.back();
  }

}
