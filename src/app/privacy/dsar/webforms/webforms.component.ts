import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CCPAFormConfigurationService } from 'src/app/_services/ccpaform-configuration.service';
import { OrganizationService, UserService } from 'src/app/_services';
import { CCPAFormFields } from 'src/app/_models/ccpaformfields';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {moduleName} from '../../../_constant/module-name.constant';
import { DataService } from 'src/app/_services/data.service';
import { DirtyComponents } from 'src/app/_models/dirtycomponents';

interface WebFormModel {
  crid: any;
  form_name: string;
  form_status: string;
  OID: any;
  PID: any;
  active: boolean;
  settings: any;
  workflow: any;
  approver: any;
  days_left: number;
  created_at: string;
  updated_at: string;
  request_form: CCPAFormFields;
}

@Component({
  selector: 'app-webforms',
  templateUrl: './webforms.component.html',
  styleUrls: ['./webforms.component.scss']
})
export class WebformsComponent implements OnInit, DirtyComponents {
  selectedProperty: any;
  currentOrgID: any;
  propertyID: any;
  currentPropertyName: any;
  formList: any = []; // Observable<WebFormModel[]>;
  // loading = false;
  mySubscription;
  currentOrganization: any;
  alertMsg: any;
  alertType: any;
  dismissible = true;
  isOpen = false;
  currentUser: any;
  currentuserID: any;
  orgDetails: any;
  isDirty = false;
  activePage = 1;
  numofRecords: number = 10;
  totalRecordsAvailable: number;
  dataLoadingMsg: string;
  startrecord: number;
  endrecords: number;
  selectedPageNumber: number;
  previousNumbersLeft: number;
  toNumbers: number;
  fromNumbers: number;
  licenseAvailabilityObj = {};
  planUsageByOrgid = [];

  constructor(private ccpaFormConfigService: CCPAFormConfigurationService,
              private organizationService: OrganizationService,
              private loading: NgxUiLoaderService,
              private userService: UserService,
              private dataService: DataService,
              private router: Router) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.loadCurrentProperty();
        this.currentLoggedInUser();
      }
    });
  }

  ngOnInit() {
    // this.loading = true;
    this.loadCurrentProperty();
    this.currentLoggedInUser();
  }

  loadCurrentProperty() {
    this.organizationService.currentProperty.subscribe((data) => {
      if (data !== '') {
        this.orgDetails = data;
       } else {
        const orgDetails = this.organizationService.getCurrentOrgWithProperty();
        this.orgDetails = orgDetails;
        this.currentOrgID = orgDetails.organization_id;
        }
    });

    this.currentOrganization = this.orgDetails.organization_name;
    this.currentPropertyName = this.orgDetails.property_name;
    this.getCCPAFormList(this.orgDetails);

  }

  getCCPAFormList(orgDetails) {
    this.loading.start();
    const perPageRecords = this.numofRecords ? this.numofRecords : 10;
     const pagelimit = '?limit=' + perPageRecords + '&page=' + this.activePage;
    if (orgDetails !== undefined) {
      this.ccpaFormConfigService.getCCPAFormList(orgDetails.organization_id, orgDetails.property_id,
        this.constructor.name, moduleName.dsarWebFormModule,pagelimit)
        .subscribe((data) => {
          this.loading.stop();
          if (data.length !== 0) {
            this.formList = data.response;
            this.totalRecordsAvailable = data.count;
            // this.loading = false;
            return this.formList;
          } else {
            return this.formList.length = 0;
            //  this.loading = false;

          }
        }, (error) => {
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
          // this.loading = false;
        });
    }
  }

  showForm(data) {
    this.ccpaFormConfigService.removeCurrentSelectedFormData();
    this.ccpaFormConfigService.captureCurrentSelectedFormData(data);
    this.router.navigate(['/privacy/dsar/dsarform', data.crid]);
  }

  navigateToDSARForm() {
   if (this.currentPropertyName !== undefined) {
    if(this.isLicenseLimitAvailable()){
      this.ccpaFormConfigService.removeCurrentSelectedFormData();
      this.router.navigate(['/privacy/dsar/dsarform']);
     }
    } else {
      this.alertMsg = 'Please Select property first!';
      this.isOpen = true;
      this.alertType = 'danger';
    }
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  currentLoggedInUser(){
    this.userService.getLoggedInUserDetails(this.constructor.name, moduleName.webFormModule ).subscribe((resp) => {
          this.currentUser = resp;
          this.currentuserID = this.currentUser.response.uid;
        });
  }

  isLicenseLimitAvailable(): boolean{
      return this.dataService.isLicenseLimitAvailableForOrganization('form',this.dataService.getAvailableLicenseForFormAndRequestPerOrg());
  }

  canDeactivate(){
    return this.isDirty;
  }

  onPagesizeChangeEvent(event) {
    this.numofRecords =  Number(event.target.value);
  }

  displayActivePage(activePageNumber: number): void {
    this.activePage = activePageNumber;
    this.selectedPageNumber = this.activePage;
    if(activePageNumber === 1){
      this.fromNumbers = activePageNumber;
    }else{
      this.fromNumbers = this.numofRecords * (this.selectedPageNumber - 1) + 1; // activePageNumber + (activePageNumber - 1);
    }
    let toNumbers = this.numofRecords * this.selectedPageNumber;
    if(toNumbers >= this.totalRecordsAvailable){
      this.toNumbers = this.totalRecordsAvailable;
    }else {
      this.toNumbers = toNumbers;
    }
    this.getCCPAFormList(this.orgDetails);
  }

  

  // ngOnDestroy() {
  //   if (this.mySubscription) {
  //     this.mySubscription.unsubscribe();
  //   }
  // }
}
