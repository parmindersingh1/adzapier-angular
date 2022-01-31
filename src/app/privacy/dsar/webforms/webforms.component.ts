import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CCPAFormConfigurationService } from 'src/app/_services/ccpaform-configuration.service';
import { OrganizationService, UserService } from 'src/app/_services';
import { CCPAFormFields } from 'src/app/_models/ccpaformfields';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {moduleName} from '../../../_constant/module-name.constant';
import { DataService } from 'src/app/_services/data.service';
import { DirtyComponents } from 'src/app/_models/dirtycomponents';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { debounceTime, filter, take } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

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
  @ViewChild('confirmTemplate', { static: false }) confirmModal: TemplateRef<any>;
  modalRef: BsModalRef;
  confirmationForm: FormGroup;
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
  isconfirmationsubmitted: boolean;
  selectedWebForm: any;
  controlname: string;
  queryOID;
  queryPID;
  constructor(private ccpaFormConfigService: CCPAFormConfigurationService,
              private organizationService: OrganizationService,
              private loading: NgxUiLoaderService,
              private userService: UserService,
              private dataService: DataService,
              private formBuilder: FormBuilder,
              private bsmodalService: BsModalService,
              private activateRoute:ActivatedRoute,
              private router: Router,
              private titleService: Title 
              ) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.loadCurrentProperty();
        this.currentLoggedInUser();
      }
    });
   

   this.activateRoute.queryParamMap
   .subscribe(params => {
     this.queryOID = params.get('oid');
     this.queryPID = params.get('pid'); 
    });

    this.titleService.setTitle("DSAR Web Forms - Adzapier Portal");

  }

  ngOnInit() {
    // this.loading = true;
   
    this.loadCurrentProperty();
    this.currentLoggedInUser();
    this.licenseAvailabilityForFormAndRequestPerOrg(this.currentOrgID);
    this.confirmationForm = this.formBuilder.group({
      userInput: ['', [Validators.required]]
    });
  }

  get confirmDelete() { return this.confirmationForm.controls; }

  loadCurrentProperty() {
    this.organizationService.currentProperty.subscribe((data) => {
      if (data !== '') {
        this.orgDetails = data;
        this.currentOrgID = this.orgDetails.organization_id || this.orgDetails.response.oid || this.queryOID;
       } else {
       // const orgDetails = this.organizationService.getCurrentOrgWithProperty();
        this.orgDetails = {
          organization_id : this.queryOID,
          property_id: this.queryPID
        };
        this.currentOrgID = this.orgDetails.organization_id || this.queryOID;
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
      this.ccpaFormConfigService.getCCPAFormList(orgDetails.organization_id || orgDetails.response.oid, orgDetails.property_id || orgDetails.response.id,
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
    this.router.navigate(['/privacy/dsar/dsarform', data.crid], { queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling:'merge', skipLocationChange:false});
  }

  navigateToDSARForm() {
   if (this.currentPropertyName !== undefined) {
    if(this.isLicenseLimitAvailable()){
      this.ccpaFormConfigService.removeCurrentSelectedFormData();
      this.router.navigate(['/privacy/dsar/dsarform'],{ queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling:'merge', skipLocationChange:false});
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
      return this.dataService.isLicenseLimitAvailableForOrganizationRestrication('form',this.dataService.getAvailableLicenseForFormAndRequestPerOrg());
  }

  licenseAvailabilityForFormAndRequestPerOrg(org){
    this.dataService.removeAvailableLicenseForFormAndRequestPerOrg();
    this.dataService.checkLicenseAvailabilityPerOrganization(org).pipe(take(1)).subscribe(results => {
      let finalObj = {
        ...results[0].response,
        ...results[1].response,
        ...results[2].response
      }
      this.dataService.setAvailableLicenseForFormAndRequestPerOrg(finalObj);
    },(error)=>{
      console.log(error)
    });
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

  cancelModal() {
    this.modalRef.hide();
    this.confirmationForm.reset();
    this.isconfirmationsubmitted = false;
    return false;
  }

  onSubmitConfirmation(selectedaction) {
    this.isconfirmationsubmitted = true;
    if (this.confirmationForm.invalid) {
      return false;
    } else {
      const userInput = this.confirmationForm.value.userInput;
      if (userInput === 'Delete') {
         if (selectedaction === 'web form') {
          this.confirmDeleteWebForm();
        }
      } else {
        return false;
      }
    }
  }

  removeWebForm(obj, control: string) {
    this.controlname = control;
    this.selectedWebForm = obj;
    this.openModal(this.confirmModal);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.bsmodalService.show(template, { class: '' });
  }

  showControlContent(): string {
      return this.selectedWebForm.form_name;
  }

  confirmDeleteWebForm() {
    const i = this.formList.findIndex((t) => t.crid === this.selectedWebForm.crid);
    this.modalRef.hide();
    let reqObj = {
      active:false
    }
    this.ccpaFormConfigService.deleteDSARForm(this.selectedWebForm.OID,this.selectedWebForm.PID,this.selectedWebForm.crid,reqObj,this.constructor.name, moduleName.webFormModule).subscribe(data => {
      if(data.status == 200){
        if(data.response.indexOf('Selected webform') != -1){
          this.formList[i].active = false;
          this.formList = [...this.formList];
          this.totalRecordsAvailable = this.totalRecordsAvailable - 1;
        }
        this.confirmationForm.value.userInput = '';
        this.alertMsg = data.response
        this.isOpen = true;
        this.alertType = 'info';
        this.confirmationForm.controls['userInput'].setValue('');
        this.isconfirmationsubmitted = false;
        this.licenseAvailabilityForFormAndRequestPerOrg(this.currentOrgID);
      }
    },(error) => {
      this.alertMsg = error;
      this.isOpen = true;
      this.alertType = 'danger';
      this.confirmationForm.controls['userInput'].setValue('');
      this.isconfirmationsubmitted = false;
    })
  }
}
