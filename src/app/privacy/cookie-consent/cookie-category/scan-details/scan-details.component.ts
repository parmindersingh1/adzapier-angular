import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {moduleName} from '../../../../_constant/module-name.constant';
import {CookieCategoryService} from '../../../../_services/cookie-category.service';
import {SortEvent} from 'primeng/api';
import {ChartOptions} from 'chart.js';
import {featuresName} from '../../../../_constant/features-name.constant';
import {AuthenticationService, UserService} from '../../../../_services';
import {DataService} from '../../../../_services/data.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-scan-details',
  templateUrl: './scan-details.component.html',
  styleUrls: ['./scan-details.component.scss']
})
export class ScanDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scan') Scanpopup: TemplateRef<any>;

  scanJobsList = [];
  scanJobsCount: 0;
  isScanning = false;
  cookieCategory: any;
  scanForm:FormGroup;
  editscanForm:FormGroup;
  setInterval = null;
  step = 0;
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
  public chartTypeLabels: Array<string> = ['Cookies', 'Page Scans', 'Tags'];
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
  queryOID;
  queryPID;
  modalRef: BsModalRef;
  scanrecord : any;
  update = false;
  enterpriseData: any;
  show = false;
  constructor(private service: CookieCategoryService,
              private authService: AuthenticationService,
              private userService: UserService,
              private dataService: DataService,
              private loading: NgxUiLoaderService,
              private _cd: ChangeDetectorRef,
              private activateRoute: ActivatedRoute,
              private formBuilder:FormBuilder,
              private bsmodalService: BsModalService,

  ) {
  }

  ngOnInit(): void {
    this.userService.addUserActionOnActualButton.next({quickstartid:8,isclicked:true,isactualbtnclicked:true});
    this.activateRoute.queryParamMap
      .subscribe(params => {
        this.queryOID = params.get('oid');
        this.queryPID = params.get('pid');
      });
      this.scanForm = this.formBuilder.group({
        loginurl: [''],
        redirecturl:[''],
        username:[''],
        usernamevalue:[''],
        password:[''],
        passwordvalue:[''],
        submitbutton:['']
      });

      this.editscanForm = this.formBuilder.group({
        loginurl: [''],
        redirecturl:[''],
        username:[''],
        usernamevalue:[''],
        password:[''],
        passwordvalue:[''],
        submitbutton:['']
      });
    this.onGetSubscriptionData();
    this.onGetLastScanJobs();
    this.ScanbehindLoginrecord();
    this.onCheckEnterpriseSubscription();
  }

  ngAfterViewInit() {
    this.setInterval = setInterval(() => {
      if (this.lastScan.scanner_status === 'running' || this.lastScan.scanner_status === 'inQueue' || this.lastScan.scanner_status === 'inProgress') {
        this.onGetLastScanJobs();
      }
    }, 20000);
  }

  get f() {
    return this.editscanForm.controls;
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
      // if (res.hasOwnProperty('lastScan')) {
      //   if (Object.keys(res.lastScan).length > 0) {
      //     this.lastScan = res.lastScan;
      //     this.chartTypeData = [this.lastScan.total_cookies, this.lastScan.total_localstorage, this.lastScan.total_page_scans, this.lastScan.total_tages];
      //   }
      // }
      this._cd.detectChanges();
    }, error => {
      this.loading.stop();
      this.tLoading = false;
    });
    // }, 10000)
  }

  next(){
    this.step = this.step + 1;
  }

  prev(){
    this.step = this.step - 1;
  }


  onGetLastScanJobs() {
    // setInterval( () => {
    this.updaing = true;
    this.service.getLastScanningData(this.constructor.name, moduleName).subscribe(res => {
      this.updaing = false;
      if (res) {
          if (Object.keys(res).length > 0) {
            this.lastScan = res.response;
            this.chartTypeData = [this.lastScan.total_cookies, this.lastScan.total_page_scans, this.lastScan.total_tages];
          }
          this.authService.notificationUpdated.next(true);
      }
      this._cd.detectChanges();
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

  onCheckEnterpriseSubscription(){
    this.enterpriseData = this.dataService.getCurrentPropertyPlanDetails();
    if(this.enterpriseData.response.plan_details.cookieConsent.product_name == 'Cookie Consent Management - Enterprise'){
      this.show = true;
    }else{
      this.show = false;
    }
  }

  onCheckSubscription() {
    const resData: any = this.dataService.getCurrentPropertyPlanDetails();
    const status = this.dataService.isAllowFeature(resData.response, featuresName.DOMAIN_SCAN);
    if (this.availablePlan.scan_available == -1) {
      return true;
    }
    if (!this.availablePlan.scan_available || this.availablePlan.scan_available < 0) {
      this.dataService.openSubcriptionModalForRestrication(resData);
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
      this.modalRef.hide();
      this.isScanning = false;
      this.lastScan.scanner_status = 'inQueue';
      this.onGetSubscriptionData();
      this.onGetDataFromServer();
      this.onGetLastScanJobs();
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

  ScanbehindLogin(){
    const payload : any= {
        login_url:this.scanForm.value.loginurl,
        redirect_url:this.scanForm.value.redirecturl,
        username:this.scanForm.value.username,
        username_value:this.scanForm.value.usernamevalue,
        password:this.scanForm.value.password,
        password_value:this.scanForm.value.passwordvalue,
        submit_button:this.scanForm.value.submitbutton  
    }

    this.service.scanbehindLogin(this.constructor.name, moduleName.pricingModule,payload).subscribe(res => {
      const result: any = res;
      if (result.status === 201 || result.status === 200) {
        this.isOpen = true;
        this.alertMsg = result.message;
        this.alertType = 'success';
        this.ScanbehindLoginrecord();
        this.next();        
      }
    }, error => {
      this.loading.stop();
      console.log(error);
    });
  
  }

  hidediv(){
    this.modalRef.hide();
    this.ScanbehindLoginrecord();
  }


  ScanbehindLoginrecord(){
   this.loading.start();
    this.service.scanbehindLoginRecord(this.constructor.name, moduleName.pricingModule).subscribe(res => {
      this.loading.stop();
      const result: any = res;
      if (result.status === 200) {
        this.scanrecord = result.response;
        if(result.message !== "No data exists"){
          this.update = true;
        }else{
          this.update = false;
        }
      }
    }, error => {
      this.loading.stop();
      console.log(error);
    });
  
  }

  ScanbehindLoginUpdate(){

    this.loading.start();
    const payload : any = {
      login_url:this.editscanForm.value.loginurl,
      redirect_url:this.editscanForm.value.redirecturl,
      username: this.editscanForm.value.username,
      username_value:this.editscanForm.value.usernamevalue,
      password:this.editscanForm.value.password,
      submit_button:this.editscanForm.value.submitbutton
    
  }

  if(this.editscanForm.value.passwordvalue){
    payload.password_value = this.editscanForm.value.passwordvalue
  }
 
  this.service.scanbehindLoginUpdate(this.constructor.name, moduleName.pricingModule,payload).subscribe(res => {
    const result: any = res;
    this.loading.stop();
    if (result.status === 201 || result.status === 200) {
      this.isOpen = true;
      this.alertMsg = result.message;
      this.alertType = 'success'    
      this.modalRef.hide();
      this.ScanbehindLoginrecord();
    }
  }, error => {
    this.loading.stop();
    console.log(error);
  });
  }


  editscanDetails(editscan) {
    this.editscanForm.patchValue({
      loginurl: this.scanrecord.login_url,
      redirecturl: this.scanrecord.redirect_url,
      username: this.scanrecord.username,
      usernamevalue: this.scanrecord.username_value,
      password: this.scanrecord.password,
      passwordvalue: this.scanrecord.password_value,
      submitbutton: this.scanrecord.submit_button_id,
    });
    this.modalRef = this.bsmodalService.show(editscan, {class: 'modal-md'});
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  ngOnDestroy() {
    clearInterval(this.setInterval);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.bsmodalService.show(template, { class: 'modal-md', keyboard: false, backdrop: true, ignoreBackdropClick: true });
  }

  onCancelClick(){
    this.modalRef.hide();
  }
}
