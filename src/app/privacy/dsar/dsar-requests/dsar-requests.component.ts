import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OrganizationService, UserService } from 'src/app/_services';
import { CompanyService } from 'src/app/company.service';
import { DsarRequestService } from 'src/app/_services/dsar-request.service';

@Component({
  selector: 'app-dsar-requests',
  templateUrl: './dsar-requests.component.html',
  styleUrls: ['./dsar-requests.component.scss']
})
export class DsarRequestsComponent implements OnInit {
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
  p = 1;
  pageSize: any = 5;
  totalCount: any;
  paginationConfig = { itemsPerPage: this.pageSize, currentPage: this.p, totalItems: this.totalCount };
  currentManagedOrgID: any;
  allFilterData: any = {
    filter_status: [],
    filter_Request_type: [],
    filter_Subject_type: [],
    filter_due_in: []
  };
  currrentManagedPropID: any;
  public inputValue = '';
  public debouncedInputValue = this.inputValue;
  private searchDecouncer$: Subject<string> = new Subject();
  subjectType = '';
  requestType = '';
  status = '';
  dueIn = '';

  constructor(
    private orgservice: OrganizationService,
    private userService: UserService,
    private companyService: CompanyService,
    private router: Router,
    private loading: NgxUiLoaderService,
    private dsarRequestService: DsarRequestService
  ) { }

  ngOnInit() {
    this.paginationConfig.itemsPerPage = 5;
    this.onGetPropsAndOrgId();
    this.onGetDsarRequestList();
    this.onGetRequestListFilter();
    this.setupSearchDebouncer();
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

  onGetDsarRequestList() {
    this.loading.start();
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.dsarRequestService.getDsarRequestList(this.currentManagedOrgID, this.currrentManagedPropID, pagelimit)
      .subscribe((data) => {
        this.loading.stop();
        if (data['response']) {
          this.requestsList = data['response'];
          this.paginationConfig.totalItems = data.count;
        }
      }, error => {
        this.loading.stop();
        console.log(error);
      });
  }


  pageChangeEvent(event) {
    this.paginationConfig.currentPage = event;
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.loading.start();
    this.dsarRequestService.getDsarRequestList(this.currentManagedOrgID, this.currrentManagedPropID, pagelimit)
      .subscribe((data) => {
        this.loading.stop();
        const key = 'response';
        this.requestsList = data[key];
        this.paginationConfig.totalItems = data.count;
        return this.requestsList;
      }, error => {
        this.loading.stop();
        console.log(error);
      });
  }

  onGetRequestListFilter() {
    this.loading.start();
    this.dsarRequestService.getDsarRequestFilter(this.currentManagedOrgID, this.currrentManagedPropID)
      .subscribe(res => {
        this.loading.stop();
        if (res) {
          this.allFilterData = res;
        }
      }, error => {
        this.loading.stop();
        console.log(error);
      });
  }

  onChangeEvent(event) {
    this.paginationConfig.itemsPerPage = Number(event.target.value);
    this.searchFilter();
  }

  public onSearchInputChange(term: string): void {
    this.searchDecouncer$.next(term);
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
    const params = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage
      + '&name=' + this.inputValue + '&subject_type=' + this.subjectType + '&request_type=' + this.requestType
      + '&status=' + this.status + '&due_in=' + this.dueIn;
    this.loading.start();
    this.dsarRequestService.getDsarRequestFilterList(this.currentManagedOrgID, this.currrentManagedPropID, params)
      .subscribe(res => {
        this.loading.stop();
        if (res['response']) {
          this.requestsList = res['response'];
        }
      }, error => {
        this.loading.stop();
        console.log(error);
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

  navigateToWebForm(id) {
   // this.router.navigate(['privacy/dsar/dsarform', id]);
    this.router.navigate(['/privacy/dsar/dsarform', { crid: id}]);
  }
}
