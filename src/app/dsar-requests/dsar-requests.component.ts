import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrganizationService, UserService} from "../_services";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DomSanitizer} from "@angular/platform-browser";
import {CompanyService} from "../company.service";
import {Router} from "@angular/router";
import {NgxUiLoaderService} from "ngx-ui-loader";

@Component({
  selector: 'app-dsar-requests',
  templateUrl: './dsar-requests.component.html',
  styleUrls: ['./dsar-requests.component.scss']
})
export class DsarRequestsComponent implements OnInit {
  submitted: boolean;
  requestsList: any = [{
    id: '1akB7JSBSN',
    name: 'Dharmesh',
    organization: 'kingfesh',
    property: 'mykingfesh.com',
    requestType: 'New',
    subjectType: 'Customer',
    daysLeft: 45,
    approver: 'Dharmesh',
    country: 'USA',
    state: 'CA',
    webForm: 'MyWebFrom1',
    dateCreated: '2014-04-29'
  },
    {
      id: '1akB7JSBSN',
      name: 'John Doe',
      organization: 'kingfesh',
      property: 'mykingfesh.com',
      requestType: 'Verify Request',
      subjectType: 'Customer',
      daysLeft: 45,
      approver: 'Dharmesh Patel',
      country: 'USA',
      state: 'CA',
      webForm: 'MyWebFrom1',
      dateCreated: '2014-04-29'
    },
    {
      id: '1akB7JSBSN',
      name: 'Will Smith',
      organization: 'kingfesh',
      property: 'mykingfesh.com',
      requestType: 'In Progress',
      subjectType: 'Customer',
      daysLeft: 45,
      approver: 'Dharmesh Patel',
      country: 'USA',
      state: 'CA',
      webForm: 'MyWebFrom1',
      dateCreated: '2014-04-29'
    },
    {
      id: '1akB7JSBSN',
      name: 'Aditya Mishra',
      organization: 'kingfesh',
      property: 'mykingfesh.com',
      requestType: 'In Progress',
      subjectType: 'Customer',
      daysLeft: -6,
      approver: 'Dharmesh Patel',
      country: 'USA',
      state: 'CA',
      webForm: 'MyWebFrom1',
      dateCreated: '2014-04-29'
    },
  ];
  orgDetails: any = [];
  propertyList: any;
  isOpen: boolean = false;
  propertyname: any;
  website: any;
  logourl: any;
  organizationname: any;
  taxidnumber: any;
  addressone: any;
  addresstwo: any;
  cityname: any;
  statename: any;
  zipcodenum: any;
  myContext;
  showOrgDetails: boolean = false;
  isEditProperty: boolean;
  p = 1;
  pageSize: any = 5;
  totalCount: any;
  paginationConfig = { itemsPerPage: this.pageSize, currentPage: this.p, totalItems: this.totalCount };
  searchText;
  ascNumberSort: any;
  constructor(
              private orgservice: OrganizationService,
              private userService: UserService,
              private companyService: CompanyService,
              private router: Router,
              private loading: NgxUiLoaderService,
  ) { }

  ngOnInit() {
    this.paginationConfig.itemsPerPage = this.requestsList.length;
    this.loadOrganizationList();
  }

  loadOrganizationList() {
    // this.paginationConfig.currentPage = event;
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    // this.loading.start();
    // this.orgservice.orglist(pagelimit).subscribe((data) => {
    //   this.loading.stop();
    //   const key = 'response';
    //   this.requestsList = data[key];
    //   this.paginationConfig.totalItems = data.count;
    //   return this.requestsList;
    // });

    // this.orgservice.orglist().subscribe((data) => {
    //   const key = 'response';
    //   this.requestsList = data[key];
    //   this.paginationConfig.totalItems = data.count;
    // });

  }


  loadOrganizationDetails(org) {
    this.orgDetails = [];
    this.showOrgDetails = !this.showOrgDetails;
    this.orgservice.viewOrganizationDetails(org.orgid).subscribe((data) => {
      const key = 'response';
      this.orgDetails.push(data[key]);
    }, (error) => {
      this.loading.stop();
      alert(JSON.stringify(error));
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getPropertyList(id): any {
    this.isOpen = !this.isOpen;
    this.orgservice.getPropertyList(id).subscribe((data) => {
      this.orgservice.emitUpdatedOrgList.emit(data.response);
      if (!data.response) {
        alert("Adding property is mandatory. Add Property first.");
      }

      return this.propertyList = data.response;
    });
  }


  pageChangeEvent(event) {
    this.paginationConfig.currentPage = event;
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.loading.start();
    this.orgservice.orglist(pagelimit).subscribe((data) => {
      this.loading.stop();
      const key = 'response';
      this.requestsList = data[key];
      this.paginationConfig.totalItems = data.count;
      return this.requestsList;
    });
  }

  onChangeEvent(event) {
    this.paginationConfig.itemsPerPage = Number(event.target.value);
  }

  sortNumberColumn() {
    this.ascNumberSort = !this.ascNumberSort;
    if(this.ascNumberSort) {
      this.requestsList.sort((a, b) => a - b); // For ascending sort
    } else {
      this.requestsList.sort((a, b) => b - a); // For descending sort
    }
  }

}
