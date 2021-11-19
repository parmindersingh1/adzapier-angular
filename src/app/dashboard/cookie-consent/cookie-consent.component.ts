import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from '../../_services/dashboard.service';
import {OrganizationService} from '../../_services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {moduleName} from '../../_constant/module-name.constant';
import {DataService} from '../../_services/data.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {BsDatepickerConfig, DatepickerDateCustomClasses} from 'ngx-bootstrap/datepicker';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
const colorCodes = [ '#f77eb9', '#fdb16d', '#c693f9',   '#65e0e0', '#69b2f8',   '#6fd39b'];
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
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{ticks: {
          beginAtZero: true
        }}] },

    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['10/19/2021 - 11/18/2021'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = ['test'];
  public chartColors: any[] = [
    {
      backgroundColor:  [ '#f77eb9', '#fdb16d', '#c693f9',   '#65e0e0', '#69b2f8',   '#6fd39b']
    }];
  public barChartData: ChartDataSets[] = [];

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
  queryOID;
  queryPID;

  bsConfig: Partial<BsDatepickerConfig>;
  dateCustomClasses: DatepickerDateCustomClasses[];
  searchbydaterange: any = '';
  date1: Date = new Date('yyyy-mm-dd');
  ranges: any = [
    {
      value: [new Date(), new Date()],
      label: 'Today'
    },
    {
      value: [new Date(new Date().setDate(new Date().getDate() - 1)),
        new Date(new Date().setDate(new Date().getDate() - 1))],
      label: 'Yesterday'
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 7)),
        new Date()
      ],
      label: 'Last 7 Days'
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 30)),
        new Date()
      ],
      label: 'Last 30 Days'
    },
    {
      value: [new Date(new Date().setDate(new Date().getMonth())), new Date()],
      label: 'This Month'
    },
    {
      value: [
        new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        new Date(new Date().getFullYear(), new Date().getMonth(), 0)
      ],
      label: 'Last Month'
    },
    {
      value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
      label: 'This Year'
    },
    {
      value: [
        new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        new Date()
      ],
      label: 'Last Year'
    },
  ];

  constructor(private dashboardService: DashboardService,
              private orgservice: OrganizationService,
              private cd: ChangeDetectorRef,
              private loading: NgxUiLoaderService,
              private dataService: DataService,
              private modalService: BsModalService,
              private _location: Location,
              private router: Router,
              private activateRoute: ActivatedRoute
  ) {
    this.dateCustomClasses = [
      {date: new Date(), classes: ['theme-dark-blue']},
    ];
    this.searchbydaterange = [new Date(new Date().setDate(new Date().getDate() - 30)), new Date()]
  }

  ngOnInit() {
    this.activateRoute.queryParamMap
      .subscribe(params => {
        this.queryOID = params.get('oid');
        this.queryPID = params.get('pid');
      });
    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      showClearButton: true,
      returnFocusToInput: true,
      dateInputFormat: 'yyyy-mm-dd',
      adaptivePosition: false,
      showTodayButton: true,
      ranges: this.ranges
    });

    this.onGetPropsAndOrgId();
    this.onGetDashboardData();
    this.onGetOptInActivity();
    // this.onGetOptOutActivity();
    // this.onGetCountryList();
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
      if (Object.keys(features).length > 0) {
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
        this.currentManagedOrgID = response.organization_id || response.response.oid;
        this.currrentManagedPropID = response.property_id || response.response.id;
      } else {
        this.currentManagedOrgID = this.queryOID;
        this.currrentManagedPropID = this.queryPID;
      }
    });
  }

  onGetDashboardData() {
    const startDate = this.searchbydaterange[0].toJSON().split('T')[0];
    const endDate = this.searchbydaterange[1].toJSON().split('T')[0];
    const params = {
      startDate: startDate,
      endDate: endDate,
    };
    this.loading.start('1');
    this.loadingSkeleton.one = true;
    this.dashboardService.getDashboardData(params, this.currrentManagedPropID, this.constructor.name, moduleName.cookieConsentModule)
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
    const startDate = this.searchbydaterange[0].toJSON().split('T')[0];
    const endDate = this.searchbydaterange[1].toJSON().split('T')[0];
    const params = {
      startDate: startDate,
      endDate: endDate,
    };
    this.loading.start('f1');
    this.loadingSkeleton.two = true;
    this.dashboardService.getOtpInActivity(params, this.currrentManagedPropID, this.constructor.name, moduleName.cookieConsentModule)
      .subscribe(res => {
        this.loadingSkeleton.two = false;
        this.loading.stop('f1');
        if (res) {
          this.optIn = res['response'];
          this.onSetOtpIn(res['response']);
        }
      }, error => {
        this.loadingSkeleton.two = false;
        this.loading.stop('f1');
      });
  }

  onSetOtpIn(data) {
    const startDate = this.searchbydaterange[0].toJSON().split('T')[0];
    const endDate = this.searchbydaterange[1].toJSON().split('T')[0];
    this.barChartLabels = [new Date(startDate) + ' - ' + new Date(endDate)];
    this.barChartData = [
      { data:  [Number(data.allow_essantial)],  label: 'Essential' },
      { data: [Number(data.allow_functional)], label: 'Functional' },
      { data: [Number(data.allow_analytics)], label: 'Analytics' },
      { data: [Number(data.allow_advertising)], label: 'Advertising' },
      { data: [Number(data.allow_socialmedia)], label: 'Social Media' },
      { data: [Number(data.allow_unknown)], label: 'Unclassified' },
    ];
    this.cd.detectChanges();
  }

  onGetOptOutActivity() {
    const startDate = this.searchbydaterange[0].toJSON().split('T')[0];
    const endDate = this.searchbydaterange[1].toJSON().split('T')[0];
    const params = {
      startDate: startDate,
      endDate: endDate,
    };
    this.loadingSkeleton.three = true;
    this.loading.start('f2');
    this.dashboardService.getOtpOutActivity(params, this.currrentManagedPropID, this.constructor.name, moduleName.cookieConsentModule)
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
    const startDate = this.searchbydaterange[0].toJSON().split('T')[0];
    const endDate = this.searchbydaterange[1].toJSON().split('T')[0];
    const params = {
      startDate: startDate,
      endDate: endDate,
    };
    this.dashboardService.getConsentDetails(params, this.currrentManagedPropID, this.constructor.name, moduleName.cookieConsentModule)
      .subscribe((res: any) => {
        this.loading.stop('f3');
        this.loadingSkeleton.four = false;
        if (res) {
          this.consentDetails = res.response;
        }
      }, error => {
        this.loadingSkeleton.four = false;
        this.loading.stop('f3');
      });
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
    const startDate = this.searchbydaterange[0].toJSON().split('T')[0];
    const endDate = this.searchbydaterange[1].toJSON().split('T')[0];

    // this.loading.start('f7');
    const params = {
      // country: 'IN'
      startDate: startDate,
      endDate: endDate,
      country: this.currentCountryMap
    };
    this.loadingSkeleton.five = true;
    this.dashboardService.getMapDataForConsentDashboard(this.currrentManagedPropID, params, this.constructor.name, moduleName.cookieConsentModule)
      .subscribe((res: any) => {
        this.loadingSkeleton.five = false;
        this.loading.stop('f7');
        const result = res.response;
        const resData = [...res.response];

        if (this.currentCountryMap === 'us') {
          for (const countryData of result) {
            this.stateCountryColor[`${countryData.state.toLowerCase()}`] = '#69b2f8';
          }
          this.stateList = result;
          this.onInItStateMap();
        } else {
          this.countryColor = [];
          for (const countryData of result) {
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
      onLabelShow: (event, label, code) => {
        for (const stateData of that.stateList) {
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
      onLabelShow: (event, label, code) => {
        for (const countryData of resData) {
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
    //this.router.navigate(['/home/dashboard/analytics']);
    this.router.navigate(['/home/dashboard/analytics'], {
      queryParams: {oid: this.queryOID, pid: this.queryPID},
      queryParamsHandling: 'merge',
      skipLocationChange: false
    });
    this.modalRef.hide();
  }

  backToParentlink() {
    this.router.navigate(['/home/dashboard/cookie-consent'], {
      queryParams: {oid: this.queryOID, pid: this.queryPID},
      queryParamsHandling: 'merge',
      skipLocationChange: false
    });
  }

}
