import {
  Component, OnInit, ViewChild, Input, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, AfterContentChecked,
  AfterViewInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OrganizationService, UserService } from 'src/app/_services';
import { CompanyService } from 'src/app/company.service';
import { DsarRequestService } from 'src/app/_services/dsar-request.service';
import { CCPAFormConfigurationService } from 'src/app/_services/ccpaform-configuration.service';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { moduleName } from 'src/app/_constant/module-name.constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/_services/data.service';
import { BillingService } from 'src/app/_services/billing.service';
import { BsDatepickerConfig, DatepickerDateCustomClasses } from 'ngx-bootstrap/datepicker';
import { Table } from "primeng/table";
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-dsar-requests',
  templateUrl: './dsar-requests.component.html',
  styleUrls: ['./dsar-requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default

})
export class DsarRequestsComponent implements OnInit, AfterViewInit, AfterContentChecked {
  firstone = 0;
  cols: any[];
  selectedCols: any[];
  @ViewChild('editor', { static: true }) editor;
  @ViewChild("ptable",{ static: false }) pTable: Table;
  submitted: boolean;
  propertyname: any;
  reloadRequestList = [];
  requestsList = [];
  searchrequestList = [];
  storeSearchList = [];
  website: any;
  logourl: any;
  organizationname: any;
  taxidnumber: any;
  addressone: any;
  addresstwo: any;
  cityname: any;
  statename: any;
  zipcodenum: any;
  dismissible = true;
  currentManagedOrgID: any;
  allFilterData: any = {
    filter_status: [],
    filter_Request_type: [],
    filter_Subject_type: [],
    filter_due_in: []
  };
  eventRows: number;
  currrentManagedPropID: any;
  public inputValue = '';
  public inputValueDueIn = '';
  public debouncedInputValue = this.inputValue;
  private searchDecouncer$: Subject<string> = new Subject();
  subjectType = '';
  requestType = '';
  status = '';
  dueIn = '';
  alertMsg: any;
  isOpen = false;
  alertType: any;
  first = 0;
  rows = 0;
  totalRecords: number;
  isloading: boolean;
  activeWebFormList: any = [];
  createDSARWebFormRequest: FormGroup;
  selectedOrgID: any;
  selectedPropID: any;
  selectedCRID: any;
  organizationSubscription: any;
  organizationPlanDetails: any;
  bsConfig: Partial<BsDatepickerConfig>;
  dateCustomClasses: DatepickerDateCustomClasses[];
  searchbydaterange: any = '';
  searchparams:any;
  date1: Date = new Date('yyyy-mm-dd');
  ranges: any = [
    {
      value: [new Date(),new Date()],
      label: "Today"
    },
    {
      value: [new Date(new Date().setDate(new Date().getDate() - 1)),
      new Date(new Date().setDate(new Date().getDate() - 1))],
      label: "Yesterday"
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 7)),
        new Date()
      ],
      label: "Last 7 Days"
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 30)),
        new Date()
      ],
      label: "Last 30 Days"
    },
    {
      value: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)],
      label: "This Month"
    },
    {
      value: [
        new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        new Date(new Date().getFullYear(), new Date().getMonth(), 0)
      ],
      label: "Last Month"
    },
    {
      value: [new Date(new Date().getFullYear(), 0, 1),new Date()],
      label: "This Year"
    },
    {
      value: [
        new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        new Date()
      ],
      label: "Last Year"
    },
  ];
  queryOID;
  queryPID;
  issearchfilteractive:boolean = false;
  issearchfilterForReq:boolean = false;
  issearchfilterForSub:boolean = false;
  issearchfilterForStatus:boolean = false;
  dprequestStatus;
  dpsubjectType;
  dprequestType;
  isSelected:boolean = true;
  lazyEvent;
  selectedDateRange;
  currentSortorder:any;
  constructor(
    private orgservice: OrganizationService,
    private userService: UserService,
    private companyService: CompanyService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private loading: NgxUiLoaderService,
    private dsarRequestService: DsarRequestService,
    private ccpaFormConfigService: CCPAFormConfigurationService,
    private cdRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private billingService: BillingService,
    private titleService: Title 

  ) {
    this.dateCustomClasses = [
      { date: new Date(), classes: ['theme-dark-blue'] },
    ];
  //  this.searchbydaterange = [new Date(new Date().setDate(new Date().getDate() - 30)),new Date()]
    this.isSelected = true;

    this.titleService.setTitle("DSAR Requests - Adzapier Portal");

    }

  ngOnInit() {
    this.isSelected = true;
    this.dprequestStatus = "";
    this.dprequestType = "";
    this.dpsubjectType = "";
    this.activateRoute.queryParamMap
      .subscribe(params => {
        this.queryOID = params.get('oid');
        this.queryPID = params.get('pid');
      });
    this.onGetPropsAndOrgId();
    this.onGetRequestListFilter();
    this.setupSearchDebouncer();
    this.isloading = true;
    this.getDSARFormListToCreateRequest();
    this.createDSARWebFormRequest = this.formBuilder.group({
      webformselection: ['', [Validators.required]]
    });
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', showClearButton: true, returnFocusToInput: true, dateInputFormat: 'yyyy-mm-dd', adaptivePosition : true, showTodayButton:true, ranges: this.ranges  });

  }

  get dsar() { return this.createDSARWebFormRequest.controls; }

  onGetPropsAndOrgId() {
    this.orgservice.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.currentManagedOrgID = response.organization_id || response.response.oid || this.queryOID;
        this.currrentManagedPropID = response.property_id || response.response.id || this.queryPID;
      } else {
        this.currentManagedOrgID = this.queryOID;
        this.currrentManagedPropID = this.queryPID;
      }
    });
  }


  @Input() get selectedColumns(): any[] {
    return this.selectedCols;
  }

  set selectedColumns(val: any[]) {
    // restore original order
    this.selectedCols = this.cols.filter(col => val.includes(col));
  }

  loadrequestsListLazy(event: LazyLoadEvent) {
    if (!this.issearchfilteractive) {
      this.isloading = true;
      this.eventRows = event.rows;
      if (this.requestsList !== undefined) {

        if (event.first === 0) {
          this.firstone = 1;
          this.first = 0;
          this.lazyEvent = event;
        } else {
          this.firstone = (event.first / event.rows) + 1;
        }
        const pagelimit = '?limit=' + this.eventRows + '&page=' + this.firstone;
        const sortOrder = event.sortOrder === -1 ? 'asc' : 'desc';
        this.currentSortorder = sortOrder;
        const orderBy = '&order_by_date=' + sortOrder;
        this.currentManagedOrgID == undefined ? this.currentManagedOrgID = this.queryOID : this.currentManagedOrgID;
        this.currrentManagedPropID == undefined ? this.currrentManagedPropID = this.queryPID : this.currrentManagedPropID;
        this.dsarRequestService.getDsarRequestList(this.constructor.name, moduleName.dsarRequestModule, this.currentManagedOrgID,
          this.currrentManagedPropID, pagelimit, orderBy)
          .subscribe((data) => {
            this.isloading = false;
            const key = 'response';
            if (Object.values(data[key]).length > 0 && data[key] !== "No data found.") {
              this.requestsList = Object.values(data[key]);
              if(sortOrder === "asc"){
                this.requestsList.sort((a, b) => {
                  let dateA:any = new Date(a.created_at);
                  let dateB:any = new Date(b.created_at);
                  return dateA - dateB;
                });
              }else{
                this.requestsList.sort((a, b) => {
                  let dateA:any = new Date(a.created_at);
                  let dateB:any = new Date(b.created_at);
                  return dateB - dateA;
                });
              }
              this.reloadRequestList = [...this.requestsList];
              this.totalRecords = data.count;
              // this.rows = Object.values(data[key]).length;
            }
            this.totalRecords = data.count;
          }, error => {
            this.loading.stop();
            this.alertMsg = error;
            this.isOpen = true;
            this.alertType = 'danger';
          });
      }
    } else {//in case of filter applied subject/request type/status/duein
        if (event.first === 0) {
          this.firstone = 1;
        } else {
          this.firstone = (event.first / event.rows) + 1;
        }
      if (this.firstone > 1 && event.first !== 0) {
        this.requestsList = this.storeSearchList.slice(event.first, (event.first + event.rows));
        if (this.currentSortorder === "desc") {
          this.storeSearchList.sort((a, b) => {
            let dateA: any = new Date(a.created_at);
            let dateB: any = new Date(b.created_at);
            return dateA - dateB;
          });
        } else {
          this.storeSearchList.sort((a, b) => {
            let dateA: any = new Date(a.created_at);
            let dateB: any = new Date(b.created_at);
            return dateB - dateA;
          });
        }
        if (this.storeSearchList.length >= 10) {
          this.requestsList = this.storeSearchList.slice(event.first, (event.first + event.rows));
        } else {
          this.requestsList = this.storeSearchList;
        }
      } else {
        if (!this.issearchfilteractive) {
          this.requestsList = this.storeSearchList.slice(event.first, (event.first + event.rows));
          if (this.currentSortorder === "desc") {
            this.storeSearchList.sort((a, b) => {
              let dateA: any = new Date(a.created_at);
              let dateB: any = new Date(b.created_at);
              return dateB - dateA;
            });
          } else {
            this.storeSearchList.sort((a, b) => {
              let dateA: any = new Date(a.created_at);
              let dateB: any = new Date(b.created_at);
              return dateA - dateB;
            });
          }
          // this.requestsList = this.storeSearchList.slice(event.first, (event.first + event.rows));
          if (this.storeSearchList.length >= 10) {
            this.requestsList = this.storeSearchList.slice(event.first, (event.first + event.rows));
          } else {
            this.requestsList = this.storeSearchList;
          }
        } else {
          this.requestsList = this.storeSearchList.slice(event.first, (event.first + event.rows));
          if (this.currentSortorder === "desc") {
            this.storeSearchList.sort((a, b) => {
              let dateA: any = new Date(a.created_at);
              let dateB: any = new Date(b.created_at);
              return dateA - dateB;
            });
          } else {
            this.storeSearchList.sort((a, b) => {
              let dateA: any = new Date(a.created_at);
              let dateB: any = new Date(b.created_at);
              return dateB - dateA;
            });
          }
          if (this.storeSearchList.length >= 10) {
            this.requestsList = this.storeSearchList.slice(event.first, (event.first + event.rows));
          } else {
            this.requestsList = this.storeSearchList;
          }
        }
        }
     // }
    }

    this.cols = [
      { field: 'country', header: 'Country' },
      { field: 'org_name', header: 'Organization' },
      { field: 'property_name', header: 'Property' },
      { field: 'state', header: 'State' },
      { field: 'approver_firstname', header: 'Approver' }
    ];

    this.selectedCols = this.cols;
  }

  customSort(event: SortEvent) {
    if(event.field ==  "created_at"){
      const pagelimit = '?limit=' + this.eventRows + '&page=' + this.firstone;
      const sortOrder = event.order === -1 ? 'asc' : 'desc';
      const orderBy = '&order_by_date=' + sortOrder;
      this.currentSortorder = sortOrder;
      this.currentManagedOrgID == undefined ? this.currentManagedOrgID = this.queryOID : this.currentManagedOrgID;
      this.currrentManagedPropID == undefined ? this.currrentManagedPropID = this.queryPID : this.currrentManagedPropID;
    }     
}


  onGetRequestListFilter() {
    this.loading.start();
    this.dsarRequestService.getDsarRequestFilter(this.currentManagedOrgID, this.currrentManagedPropID,
      this.constructor.name, moduleName.dsarRequestModule)
      .subscribe(res => {
        this.loading.stop();
        if (res) {
          this.allFilterData = res;
        }
      }, error => {
        this.loading.stop();
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
      });
  }


  public onSearchInputChange(): void {
    this.searchDecouncer$.next(this.inputValue);
  }

  public clearSearchfield() {
    this.inputValue = '';
    this.searchDecouncer$.next(this.inputValue);
    this.issearchfilteractive = false;
  }

  public clearDueInSearchfield() { //for later use
    this.inputValueDueIn = '';
    this.searchDecouncer$.next(this.inputValueDueIn);
    this.issearchfilteractive = false;
  }

  private setupSearchDebouncer(): void {
    this.searchDecouncer$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe((term: string) => {
      this.debouncedInputValue = term;
      if(this.debouncedInputValue || this.issearchfilterForSub || this.issearchfilterForReq || this.issearchfilterForStatus || this.searchbydaterange !== ""){
        this.searchFilter();
      }else{
        this.onRefreshDSARList();
      }
    });
  }

  private searchFilter(): void {
    this.searchparams = "";
    if(this.selectedDateRange !== undefined){
    this.searchparams = '?limit=' + this.eventRows + '&page=' + this.firstone + '&name=' + this.inputValue + '&subject_type=' + this.subjectType + '&request_type=' + this.requestType + '&status=' + this.status + '&due_in=' + this.dueIn +  this.selectedDateRange;
    }else{
      this.searchparams = '?limit=' + this.eventRows + '&page=' + this.firstone + '&name=' + this.inputValue + '&subject_type=' + this.subjectType + '&request_type=' + this.requestType + '&status=' + this.status + '&due_in=' + this.dueIn;
    }
    this.isloading = true;
     //const sortOrder = this.currentSortorder !== undefined && this.currentSortorder !== ? this.currentSortorder : 'asc'
     const orderBy = '&order_by_date=' + 'asc';
    this.dsarRequestService.getDsarRequestList(this.constructor.name, moduleName.dsarRequestModule, this.currentManagedOrgID,
    this.currrentManagedPropID, this.searchparams, orderBy)
      .subscribe((data) => {
        this.isloading = false;
        const key = 'response';
        if (Object.values(data[key]).length > 0 && data[key] !== "No data found." && Object.keys(data[key].length !== 0)) {
          this.requestsList = Object.values(data[key]);
          if(this.currentSortorder === "asc"){
            this.requestsList.sort((a, b) => {
              let dateA:any = new Date(a.created_at);
              let dateB:any = new Date(b.created_at);
              return dateA - dateB;
            });
          }else{
            this.requestsList.sort((a, b) => {
              let dateA:any = new Date(a.created_at);
              let dateB:any = new Date(b.created_at);
              return dateB - dateA;
            });
          }
          this.storeSearchList = [...this.requestsList];
          this.reloadRequestList = [...this.requestsList];
          this.totalRecords = data.count;
          this.issearchfilteractive = true;
          if(data.count != 0){
            this.loadrequestsListLazy(this.lazyEvent);
            this.pTable.reset();
          }
        }else{
          this.requestsList = Object.values(data[key]);
          this.totalRecords = data.count;
          if(data.count != 0){
            this.loadrequestsListLazy(this.lazyEvent);
            this.pTable.reset();
          }
        }
      }, error => {
        this.loading.stop();
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
      });
  }

  onChangeRequestType(event) {
    if(event.target.value !== ""){
    this.requestType = event.target.value;
    this.issearchfilterForReq = true;
    this.searchFilter();
    }else{
      this.requestType = "";
      this.issearchfilterForReq = false;
      this.issearchfilteractive = false;
      if(this.issearchfilterForSub || this.issearchfilterForStatus || this.searchbydaterange !== ""){
        this.searchFilter();
      }else{
        this.issearchfilteractive = false;
        this.onRefreshDSARList();
      }
    }
  }

  onChangeStatus(event) {
    if(event.target.value !== ""){
      this.status = event.target.value;
      this.issearchfilterForStatus = true;
      this.searchFilter();
    }else{
      this.status = "";
      this.issearchfilterForStatus = false;
      this.issearchfilteractive = false;
      if(this.issearchfilterForSub || this.issearchfilterForReq || this.searchbydaterange !== ""){
        this.searchFilter();
      }else{
        this.onRefreshDSARList();
      }
    }
  }

  onChangeDueIn(event) {
    if(event !== "" && typeof event !== "object"){
      this.dueIn = event;
      this.searchFilter();
    } else if (event !== undefined && event.target.value !== '') {
      this.dueIn = event.target.value;
      this.searchFilter();
    }else{
      this.clearDueInSearchfield();
    }
  }

  onChangeSubjectType(event) {
    if(event.target.value !== ""){
      this.subjectType = event.target.value;
      this.issearchfilterForSub = true;
      this.searchFilter();
    }else{
      this.subjectType = "";
      this.issearchfilteractive = false;
      this.issearchfilterForSub = false;
      if(this.issearchfilterForReq || this.issearchfilterForStatus || this.searchbydaterange !== ""){
        this.searchFilter();
      }else{
        this.onRefreshDSARList();
      }
    }
  }

  viewDSARRequestDetails(res) {
    this.router.navigate(['privacy/dsar/requests-details', res.id,res.cid,this.currentManagedOrgID,this.currrentManagedPropID, res.web_form_id],{ queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling:'merge', skipLocationChange:false});
  }

  navigateToWebForm(obj) {
    this.ccpaFormConfigService.removeCurrentSelectedFormData();
    this.ccpaFormConfigService.captureCurrentSelectedFormData(obj);
    this.router.navigate(['/privacy/dsar/dsarform', obj.web_form_id]);
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  getDSARFormListToCreateRequest() {
    this.loading.start();
    this.ccpaFormConfigService.getDSARFormList(this.currentManagedOrgID, this.currrentManagedPropID,
      this.constructor.name, moduleName.dsarWebFormModule)
      .subscribe((data) => {
        this.loading.stop();
        if (data.count !== 0) {
          this.activeWebFormList = data.response;
          // this.loading = false;
          return this.activeWebFormList;
        } else {
          this.activeWebFormList.length = 0;
        }
      }, (error) => {
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
        // this.loading = false;
      });
  }

  onWebformChange($event) {
    if($event.target.value !== ''){
      const obj = JSON.parse($event.target.value);
      this.selectedOrgID = obj.OID;
      this.selectedPropID = obj.PID;
      this.selectedCRID = obj.crid;
    } else {
      this.alertMsg = 'Webform not found!';
      this.isOpen = true;
      this.alertType = 'info';
    }

  }

  onCancelClick() {
    this.submitted = false;
    this.createDSARWebFormRequest.reset();
    this.selectedOrgID = null;
    this.selectedPropID = null;
    this.selectedCRID = null;
    this.modalService.dismissAll('Canceled');
  }

  ngAfterViewInit() {
    this.cols = [
      { field: 'country', header: 'Country' },
      // { field: 'name', header: 'Name' },
      { field: 'org_name', header: 'Organization' },
      { field: 'property_name', header: 'Property' },
      { field: 'state', header: 'State' },
      { field: 'approver_firstname', header: 'Approver' }
    ];

    this.selectedCols = this.cols;
    this.cdRef.detectChanges();
  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  createWebFormRequestModal(content, data) {
    if (data !== '') {

      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

      }, (reason) => {

      });
    } else {
     if(this.isLicenseLimitAvailable()){
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

      }, (reason) => {

      });
    }
    }

  }

  onRefresh(){
    this.dprequestStatus = "";
    this.dprequestType = "";
    this.dpsubjectType = "";
    this.isSelected = true;
    this.selectedDateRange = "";
    this.searchbydaterange = "";
    this.searchparams = "";
    this.clearDueInSearchfield();    
    this.onRefreshDSARList();
  }

  onRefreshDSARList(){
    this.searchparams = "";
    const pagelimit = '?limit=' + 10 + '&page=' + 1;
    const sortOrder =  this.currentSortorder !== undefined ? this.currentSortorder : 'asc';
    const orderBy = '&order_by_date=' + sortOrder + this.selectedDateRange;
    this.currentManagedOrgID == undefined ? this.currentManagedOrgID = this.queryOID : this.currentManagedOrgID;
    this.currrentManagedPropID == undefined ? this.currrentManagedPropID = this.queryPID : this.currrentManagedPropID;
    this.dsarRequestService.getDsarRequestList(this.constructor.name, moduleName.dsarRequestModule, this.currentManagedOrgID,
      this.currrentManagedPropID, pagelimit, orderBy)
      .subscribe((data) => {
        this.isloading = false;
        const key = 'response';
        if (Object.values(data[key]).length > 0 && data[key] !== "No data found.") {
          this.requestsList = Object.values(data[key]);
          if(sortOrder === "asc"){
            this.requestsList.sort((a, b) => {
              let dateA:any = new Date(a.created_at);
              let dateB:any = new Date(b.created_at);
              return dateA - dateB;
            });
          }else{
            this.requestsList.sort((a, b) => {
              let dateA:any = new Date(a.created_at);
              let dateB:any = new Date(b.created_at);
              return dateB - dateA;
            });
          }
          this.reloadRequestList = [...this.requestsList];
        this.totalRecords = data.count;
        }else{
          this.loadrequestsListLazy(this.lazyEvent);
        }
      }, error => {
        this.loading.stop();
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
      });
  }

  previewCCPAForm() {
    this.submitted = true;
    if (this.createDSARWebFormRequest.invalid) {
      return false;
    } else {
      const formStatus = '/publish';
      if (this.selectedOrgID && this.selectedPropID) {
        if (window.location.hostname === 'localhost') {
          window.open('http://localhost:4500/dsar/form/' + this.selectedOrgID + '/'
            + this.selectedPropID + '/' + this.selectedCRID + formStatus);
          this.onCancelClick();
        }
        if (window.location.hostname === 'develop-cmp.adzpier-staging.com') {
          window.open('https://develop-privacyportal.adzpier-staging.com/dsar/form/' + this.selectedOrgID + '/'
            + this.selectedPropID + '/' + this.selectedCRID + formStatus);
          this.onCancelClick();
        } else if (window.location.hostname === 'cmp.adzpier-staging.com') {
          window.open('https://privacyportal.adzpier-staging.com/dsar/form/' + this.selectedOrgID + '/'
            + this.selectedPropID + '/' + this.selectedCRID + formStatus);
          this.onCancelClick();
        } else if (window.location.hostname === 'qa-cmp.adzpier-staging.com') {
          window.open('https://qa-privacyportal.adzpier-staging.com/dsar/form/' + this.selectedOrgID + '/'
            + this.selectedPropID + '/' + this.selectedCRID + formStatus);
          this.onCancelClick();
        } else if(window.location.hostname === 'portal.adzapier.com'){
          window.open('https://privacyportal.primeconsent.com/dsar/form/' + this.selectedOrgID + '/'
          + this.selectedPropID + '/' + this.selectedCRID + formStatus);
          this.onCancelClick();
        }
      } else {
        this.alertMsg = 'Organization or Property not found!';
        this.isOpen = true;
        this.alertType = 'danger';
      }
    }
  }

  onCheckSubscription(){
    // const resData: any = this.dataService.getCurrentOrgPlanDetails();
    this.billingService.getActivePlan(this.constructor.name, moduleName.manageSubscriptionsModule)
    .subscribe(data => {
      this.organizationSubscription = data;
      if(this.organizationSubscription !== undefined){
        for(let key of this.organizationSubscription){
          if(key.planDetails.level === 'organization' && key.total_licence > key.assigned_licence ){
            this.organizationPlanDetails = key.planDetails;
            return true;
          }
        }
      }
    });

  }

  onDateSelection(){
    if(this.searchbydaterange !== null && this.searchbydaterange !== ""){
      let date1 = this.searchbydaterange[0].toJSON().split('T')[0];
      let date2 = this.searchbydaterange[1].toJSON().split('T')[0];
      this.issearchfilteractive = true;
      let pageLimit = '?limit=' + this.eventRows + '&page=' + this.firstone;
      let selectedDateRange = '&start_date=' + date1 +  '&end_date=' + date2;
      this.selectedDateRange = selectedDateRange;
      this.isloading = true;
      this.dsarRequestService.getDsarRequestList(this.constructor.name, moduleName.dsarRequestModule, this.currentManagedOrgID,
        this.currrentManagedPropID, pageLimit, '', selectedDateRange)
        .subscribe((data) => {
          this.isloading = false;
          const key = 'response';
          if(data[key] !== "No data found."){
            this.requestsList = Object.values(data[key]);
            if(this.currentSortorder === "asc"){
              this.requestsList.sort((a, b) => {
                let dateA:any = new Date(a.created_at);
                let dateB:any = new Date(b.created_at);
                return dateA - dateB;
              });
            }else{
              this.requestsList.sort((a, b) => {
                let dateA:any = new Date(a.created_at);
                let dateB:any = new Date(b.created_at);
                return dateB - dateA;
              });
            }
            this.storeSearchList = this.requestsList;
            this.rows = data[key].length;
            this.totalRecords = data.count;
            this.pTable.reset();
           // this.loadrequestsListLazy(this.lazyEvent);
          }else{
            this.requestsList = [];
          }
        }, error => {
          this.loading.stop();
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
        });
      }else{
        this.clearDatePicker();
      }
  }

  clearDateRangePicker(){
    this.searchbydaterange = '';
    this.searchFilter();
  }

  isLicenseLimitAvailable(): boolean {
      return this.dataService.isLicenseLimitAvailableForOrganization('request',this.dataService.getAvailableLicenseForFormAndRequestPerOrg());
  }

  onCheckRequesttype(requesttype, request_form, customobj) {
    if (request_form !== undefined) {
      const requestForm = JSON.parse(request_form);
      const cdata = JSON.parse(customobj).request_type;
      const requesttypeindex = requestForm.findIndex((t) => t.controlId == requesttype);
      let filltypes = [];
      filltypes.length = 0;
      for (let i = 0; i < Object.values(cdata).length; i++) {
        requestForm[requesttypeindex].selectOptions.filter((t) => {
          if (t.request_type_id == Object.values(cdata)[i]) {
            const idx = filltypes.includes(t.name);
            if (!idx) {
              filltypes.push(t.name);
            }
          }
        });
      }
      return filltypes;
    }
  }

  onCheckSubjecttype(subjecttype, request_form, customobj) {
    if (request_form !== undefined) {
      const requestForm = JSON.parse(request_form);
      const cdata = JSON.parse(customobj).subject_type;
      const requesttypeindex = requestForm.findIndex((t) => t.controlId == subjecttype);
      let filltypes = [];
      filltypes.length = 0;
      for (let i = 0; i < Object.values(cdata).length; i++) {
        requestForm[requesttypeindex].selectOptions.filter((t) => {
          if (t.subject_type_id == Object.values(cdata)[i]) {
            const idx = filltypes.includes(t.name);
            if (!idx) {
              filltypes.push(t.name);
            }
          }
        });
      }
      return filltypes;
    }
  }

  onExportToCSV(){
    const pagelimit = this.searchparams ? this.searchparams : '?limit=' + 500000 + '&page=' + 1;
    const sortOrder =  this.currentSortorder !== undefined ? this.currentSortorder : 'asc';
    const orderBy = '&order_by_date=' + sortOrder; //+ this.selectedDateRange;
    const isExport = '&export_to_csv=' + true;
    const dateRange = this.selectedDateRange !== undefined ? this.selectedDateRange : "";
    this.currentManagedOrgID == undefined ? this.currentManagedOrgID = this.queryOID : this.currentManagedOrgID;
    this.currrentManagedPropID == undefined ? this.currrentManagedPropID = this.queryPID : this.currrentManagedPropID;
    this.dsarRequestService.getDsarRequestList(this.constructor.name, moduleName.dsarRequestModule, this.currentManagedOrgID,
      this.currrentManagedPropID, pagelimit, orderBy,dateRange, isExport)
      .subscribe((data) => { 
          const fileName = 'DSAR-Requests' + '.csv';
          this.downLoadFile(data, 'text/csv', fileName );
      }, error => {
        this.loading.stop();
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
      });
  }

  clearDatePicker(){
    this.issearchfilteractive = false;
    this.selectedDateRange = "";
    this.searchbydaterange = "";
    if(this.inputValue == "" && this.subjectType == "" && this.requestType == "" && this.status == ""){
    this.onRefreshDSARList();
    }else{
      this.searchFilter();
    }
  }

  downLoadFile(data: any, type: string, fileName) {
    const blob = new Blob([data], { type});
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = fileName;
    anchor.href = url;
    anchor.click();
  }
}
