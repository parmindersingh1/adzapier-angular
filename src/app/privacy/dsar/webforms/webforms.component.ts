import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CCPAFormConfigurationService } from 'src/app/_services/ccpaform-configuration.service';
import { OrganizationService, UserService } from 'src/app/_services';
import { CCPAFormFields } from 'src/app/_models/ccpaformfields';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {moduleName} from '../../../_constant/module-name.constant';
import { DataService } from 'src/app/_services/data.service';
import { forkJoin } from 'rxjs';
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
    if (orgDetails !== undefined) {
      this.ccpaFormConfigService.getCCPAFormList(orgDetails.organization_id, orgDetails.property_id,
        this.constructor.name, moduleName.dsarWebFormModule)
        .subscribe((data) => {
          this.loading.stop();
          if (data.length !== 0) {
            this.formList = data;
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

  licenseAvailabilityForFormAndRequestPerOrg(orgID){
    let webFormLicense = this.dataService.getWebFormLicenseLimit( this.constructor.name, moduleName.headerModule, orgID);
    let requestLicense = this.dataService.getDSARRequestLicenseLimit( this.constructor.name, moduleName.headerModule, orgID);
    forkJoin([webFormLicense, requestLicense]).subscribe(results => {
      let finalObj = {
        ...results[0].response,
        ...results[1].response,
      }
      this.dataService.setAvailableLicenseForFormAndRequestPerOrg(finalObj);
    },(error)=>{
      console.log(error)
    });
  }

  canDeactivate(){
    return this.isDirty;
  }
  // ngOnDestroy() {
  //   if (this.mySubscription) {
  //     this.mySubscription.unsubscribe();
  //   }
  // }
}
