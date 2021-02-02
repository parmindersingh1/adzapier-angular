import {
  Component, OnInit, ViewChild, Input, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, AfterContentChecked,
  AfterViewInit
} from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OrganizationService, UserService } from 'src/app/_services';
import { CompanyService } from 'src/app/company.service';
import { DsarRequestService } from 'src/app/_services/dsar-request.service';
import { CCPAFormConfigurationService } from 'src/app/_services/ccpaform-configuration.service';
import { LazyLoadEvent } from 'primeng/api';
import { moduleName } from 'src/app/_constant/module-name.constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/_services/data.service';
import { featuresName } from 'src/app/_constant/features-name.constant';
import { BillingService } from 'src/app/_services/billing.service';
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
  submitted: boolean;
  propertyname: any;
  requestsList = [];
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
  constructor(
    private orgservice: OrganizationService,
    private userService: UserService,
    private companyService: CompanyService,
    private router: Router,
    private loading: NgxUiLoaderService,
    private dsarRequestService: DsarRequestService,
    private ccpaFormConfigService: CCPAFormConfigurationService,
    private cdRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private billingService: BillingService
  ) { }

  ngOnInit() {
    this.onGetPropsAndOrgId();
    this.onGetRequestListFilter();
    this.setupSearchDebouncer();
    this.isloading = true;
    this.getCCPAFormList();
    this.createDSARWebFormRequest = this.formBuilder.group({
      webformselection: ['', [Validators.required]]
    });
  }

  get dsar() { return this.createDSARWebFormRequest.controls; }

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


  @Input() get selectedColumns(): any[] {
    return this.selectedCols;
  }

  set selectedColumns(val: any[]) {
    // restore original order
    this.selectedCols = this.cols.filter(col => val.includes(col));
  }

  loadrequestsListLazy(event: LazyLoadEvent) {
    this.isloading = true;
    this.eventRows = event.rows;
    if (this.requestsList) {

      if (event.first === 0) {
        this.firstone = 1;
      } else {
        this.firstone = (event.first / event.rows) + 1;
      }
      const pagelimit = '?limit=' + this.eventRows + '&page=' + this.firstone;
      const sortOrder = event.sortOrder === -1 ? 'desc' : 'asc';
      // const orderBy = '&orderby=' + event.sortField + ' ' + sortOrder;
      const orderBy = '&order_by_date=' + sortOrder;

      this.dsarRequestService.getDsarRequestList(this.constructor.name, moduleName.dsarRequestModule, this.currentManagedOrgID,
        this.currrentManagedPropID, pagelimit, orderBy)
        .subscribe((data) => {
          this.isloading = false;
          const key = 'response';
          this.requestsList = data[key];
          this.rows = data[key].length;
          this.totalRecords = data.count;
        }, error => {
          this.loading.stop();
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
        });
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
  }

  private setupSearchDebouncer(): void {
    this.searchDecouncer$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe((term: string) => {
      this.debouncedInputValue = term;
      this.searchFilter();
    });
  }

  private searchFilter(): void {
    const params = '?limit=' + this.eventRows + '&page=' + this.firstone
      + '&name=' + this.inputValue + '&subject_type=' + this.subjectType + '&request_type=' + this.requestType
      + '&status=' + this.status + '&due_in=' + this.dueIn;
    this.isloading = true;
    this.dsarRequestService.getDsarRequestFilterList(this.currentManagedOrgID, this.currrentManagedPropID, params,
      this.constructor.name, moduleName.dsarRequestModule)
      .subscribe(res => {
        this.isloading = false;
        const key = 'response';
        if (res[key]) {
          this.requestsList = res[key];
        }
      }, error => {
        this.isloading = false;
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
      });
  }

  onChangeRequestType(event) {
    this.requestType = event.target.value;
    this.searchFilter();
  }

  onChangeStatus(event) {
    this.status = event.target.value;
    this.searchFilter();
  }

  onChangeDueIn(event) {
    this.dueIn = event.target.value;
    this.searchFilter();
  }
  onChangeSubjectType(event) {
    this.subjectType = event.target.value;
    this.searchFilter();
  }

  viewDSARRequestDetails(res) {
    this.router.navigate(['privacy/dsar/dsar-requests-details', res.id,res.cid,this.currentManagedOrgID,this.currrentManagedPropID]);
  }

  navigateToWebForm(obj) {
    this.ccpaFormConfigService.captureCurrentSelectedFormData(obj);
    this.router.navigate(['/privacy/dsar/dsarform', obj.web_form_id]);
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  getCCPAFormList() {
    this.loading.start();
    this.ccpaFormConfigService.getCCPAFormList(this.currentManagedOrgID, this.currrentManagedPropID,
      this.constructor.name, moduleName.dsarWebFormModule)
      .subscribe((data) => {
        this.loading.stop();
        if (data.length !== 0) {
          this.activeWebFormList = data;
          // this.loading = false;
          return this.activeWebFormList;
        } else {
          return this.activeWebFormList.length = 0;
          //  this.loading = false;

        }
      }, (error) => {
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
        // this.loading = false;
      });
  }

  onWebformChange($event) {
    const obj = JSON.parse($event.target.value);
    this.selectedOrgID = obj.OID;
    this.selectedPropID = obj.PID;
    this.selectedCRID = obj.crid;
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

  previewCCPAForm() {
    this.submitted = true;
    if (this.createDSARWebFormRequest.invalid) {
      return false;
    } else {
      if (this.selectedOrgID && this.selectedPropID) {
        if (window.location.hostname === 'localhost') {
          window.open('http://localhost:4500/dsar/form/' + this.selectedOrgID + '/'
            + this.selectedPropID + '/' + this.selectedCRID);
          this.onCancelClick();
        }
        if (window.location.hostname === 'develop-cmp.adzpier-staging.com') {
          window.open('https://develop-privacyportal.adzpier-staging.com/dsar/form/' + this.selectedOrgID + '/'
            + this.selectedPropID + '/' + this.selectedCRID);
          this.onCancelClick();
        } else if (window.location.hostname === 'cmp.adzpier-staging.com') {
          window.open('https://privacyportal.adzpier-staging.com/dsar/form/' + this.selectedOrgID + '/'
            + this.selectedPropID + '/' + this.selectedCRID);
          this.onCancelClick();
        } else if(window.location.hostname === 'portal.adzapier.com'){
          window.open('https://privacyportal.primeconsent.com/dsar/form/' + this.selectedOrgID + '/'
          + this.selectedPropID + '/' + this.selectedCRID);
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

  isLicenseLimitAvailable(): boolean {
      return this.dataService.isLicenseLimitAvailableForOrganization('request',this.dataService.getAvailableLicenseForFormAndRequestPerOrg());
  }
}
