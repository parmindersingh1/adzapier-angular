import { Component, OnInit, ViewChild, Input, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, AfterContentChecked,
  AfterViewInit } from '@angular/core';
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

  constructor(
    private orgservice: OrganizationService,
    private userService: UserService,
    private companyService: CompanyService,
    private router: Router,
    private loading: NgxUiLoaderService,
    private dsarRequestService: DsarRequestService,
    private ccpaFormConfigService: CCPAFormConfigurationService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.onGetPropsAndOrgId();
    this.onGetRequestListFilter();
    this.setupSearchDebouncer();
    this.isloading = true;
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
      const sortOrder = event.sortOrder === -1 ? 'DESC' : 'ASC';
      const orderBy = '&orderby=' + event.sortField + ' ' + sortOrder;

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

  viewDSARRequestDetails(id) {
    this.router.navigate(['privacy/dsar/dsar-requests-details', id]);
  }

  navigateToWebForm(obj) {
    this.ccpaFormConfigService.captureCurrentSelectedFormData(obj);
    this.router.navigate(['/privacy/dsar/dsarform', obj.web_form_id]);
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
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

}
