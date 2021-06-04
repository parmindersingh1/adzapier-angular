import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {moduleName} from '../../../../_constant/module-name.constant';
import {CookieCategoryService} from '../../../../_services/cookie-category.service';
import {SortEvent} from 'primeng/api';
import {ChartOptions} from 'chart.js';
import {featuresName} from '../../../../_constant/features-name.constant';
import {AuthenticationService} from '../../../../_services';
import {DataService} from '../../../../_services/data.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-scan-details',
  templateUrl: './scan-details.component.html',
  styleUrls: ['./scan-details.component.scss']
})
export class ScanDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  scanJobsList = [];
  scanJobsCount: 0;
  isScanning = false;
  cookieCategory: any;
  setInterval = null;
  lastScan = {
    id: null,
    scanner_status: null,
    start_time: null,
    end_time: null,
    website: null,
    total_cookies: 0,
    total_page_scans: 0,
    total_tages: 0,
    total_localstorage: 0
  };
  updaing = false;
  availablePlan = {
    scan_available: -1,
    scan_done: 0,
    scan_limit: 0
  };
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  public chartType = 'doughnut';
  public chartLabels: Array<string> = [];
  public chartData: Array<number> = [];
  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom'
    }
  };
  pieColors = [
    {
      backgroundColor: [
        '#f77eb9', '#fdb16d', '#c693f9', '#65e0e0', '#69b2f8', '#6fd39b'
      ]
    }
  ];
  public chartTypeLabels: Array<string> = ['Cookies', 'LocalStorage', 'Page Scans', 'Tags'];
  public chartTypeData: Array<number> = [];

  selectedProducts = [];
  isUpdate = false;
  // submitted: boolean;
  addCookieForm: FormGroup;
  submitted = false;
  public firstone: number;
  tLoading = true;
  private eventRows: string;
  private pagelimit: string;
  private data: { limit: any; page: any; sortBy: any, sortColumn: any, name: any };

  constructor(private service: CookieCategoryService,
              private authService: AuthenticationService,
              private dataService: DataService,
              private loading: NgxUiLoaderService
              ) {
  }

  ngOnInit(): void {
    this.onGetSubscriptionData();
    this.onGetLastScanJobs()
  }
  ngAfterViewInit() {
    this.setInterval = setInterval( () => {
      if (this.lastScan.scanner_status === 'running' || this.lastScan.scanner_status === 'inQueue' || this.lastScan.scanner_status === 'inProgress') {
        this.onGetLastScanJobs();
      }
    }, 20000);
  }

  onGetCatList(event) {
    this.eventRows = event.rows;
    if (event.first === 0) {
      this.firstone = 1;
    } else {
      this.firstone = (event.first / event.rows) + 1;
    }
    this.pagelimit = '?limit=' + this.eventRows + '&page=' + this.firstone;
    this.data = {
      limit: this.eventRows,
      page: this.firstone,
      sortBy: event.sortOrder === -1 ? 'DESC' : 'ASC',
      sortColumn: event.sortField !== undefined ? event.sortField : '',
      name: event.globalFilter === null ? '' : event.globalFilter
    };
    this.onGetDataFromServer();
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const value1 = data1[event.field];
      const value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null) {
        result = -1;
      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else if (typeof value1 === 'string' && typeof value2 === 'string') {
        result = value1.localeCompare(value2);
      } else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      }

      return (event.order * result);
    });
  }

  onGetDataFromServer() {
    // setInterval( () => {
    this.tLoading = true;
    this.loading.start();
    this.service.getScanningData(this.data, this.constructor.name, moduleName).subscribe(res => {
      this.tLoading = false;
      this.loading.stop();
      this.scanJobsList = res.response;
      this.scanJobsCount = res.count;
      if (res.hasOwnProperty('lastScan')) {
        if (Object.keys(res.lastScan).length > 0) {
          this.lastScan = res.lastScan;
          this.chartTypeData = [this.lastScan.total_cookies, this.lastScan.total_localstorage, this.lastScan.total_page_scans, this.lastScan.total_tages];
        }
      }
    }, error => {
      this.loading.stop();
      this.tLoading = false;
    });
    // }, 10000)
  }

  onGetLastScanJobs() {
    // setInterval( () => {
    this.updaing = true;
    this.service.getLastScanningData(this.constructor.name, moduleName).subscribe(res => {
      this.updaing = false;
      if (res.hasOwnProperty('lastScan')) {
        if (Object.keys(res.lastScan).length > 0) {
          this.lastScan = res.lastScan;
          this.chartTypeData = [this.lastScan.total_cookies, this.lastScan.total_localstorage, this.lastScan.total_page_scans, this.lastScan.total_tages];
        }
      }
    }, error => {
      this.updaing = false;
    });
    // }, 10000)
  }

  onGetSubscriptionData() {
    this.service.getSubscrptionData(this.constructor.name, moduleName.cookieCategoryModule)
      .subscribe((res: any) => {
        if (res.status === 200) {
          this.availablePlan = res.response;
        }
      });
  }

  onCheckSubscription() {
    const resData: any = this.dataService.getCurrentPropertyPlanDetails();
    const status = this.dataService.isAllowFeature(resData.response, featuresName.DOMAIN_SCAN);
    if (this.availablePlan.scan_available == -1) {
      return true;
    }
    if (!this.availablePlan.scan_available || this.availablePlan.scan_available < 0) {
      this.dataService.openUpgradeModalForCookieConsent(resData);
      return false;
    }
    if (status === false) {
      return false;
    }
    return true;
  }

  onRescanCookie() {
    if (!this.onCheckSubscription()) {
      return false;
    }
    this.isScanning = true;
    this.service.cookieScanning(this.constructor.name, moduleName.cookieCategoryModule).subscribe((res: any) => {
      // this.onGetScanningStatus();
      this.isScanning = false;
      this.lastScan.scanner_status = 'inQueue';
      this.onGetLastScanJobs();
      this.onGetSubscriptionData();
      this.isOpen = true;
      this.alertMsg = res.response;
      this.alertType = 'success';
      this.authService.notificationUpdated.next(true);
    }, error => {
      this.isScanning = false;
      this.isOpen = true;
      this.alertMsg = error;
      this.alertType = 'danger';
    });
  }
  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }
  ngOnDestroy() {
    clearInterval(this.setInterval);
  }
}
