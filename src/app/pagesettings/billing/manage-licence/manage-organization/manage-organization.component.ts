import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {forkJoin, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {moduleName} from 'src/app/_constant/module-name.constant';
import { UserService } from 'src/app/_services';
import {BillingService} from 'src/app/_services/billing.service';
import {DataService} from 'src/app/_services/data.service';
import {OrganizationService} from 'src/app/_services/organization.service';

@Component({
  selector: 'app-manage-organization',
  templateUrl: './manage-organization.component.html',
  styleUrls: ['./manage-organization.component.scss']
})
export class ManageOrganizationComponent implements OnInit, OnDestroy {
  planID = '';
  propertyName: any;
  orgNameError = false;
  submitted = false;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  private currentManagedOrgID: any;
  private currrentManagedPropID: any;
  delOrgID: any;
  planName = '';

  totalLicence = 0;
  assigneLicence = 0;
  productName = '';
  orgForm: FormGroup;
  allUnSignOrgList = [];
  orgList = [];
  percents = {
    totalLicence: 0,
    assigneLicence: 0
  }
  modalRef: BsModalRef;
  skLoading = true;
  propertyList = [];
  allPropertyList = [];
  licenseAvailabilityObj = {};
  planUsageByOrgid = [];
  calculateFormUsage;
  calculateWorkflowUsage;
  calculateRequestUsage;
  queryOID;
  queryPID;
  loggedInuserDetails:any;
  currentUserOrganizationList:any;
  dismissible = true;
  constructor(private service: BillingService,
              private modalService: BsModalService,
              private activatedRoute: ActivatedRoute,
              private loading: NgxUiLoaderService,
              private formBuilder: FormBuilder,
              private dataService: DataService,
              private orgservice: OrganizationService,
              private userService: UserService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap
      .subscribe(params => {
      this.queryOID = params.get('oid');
      this.queryPID = params.get('pid');
    });
    this.onGetPropsAndOrgId();
    this.orgForm = this.formBuilder.group({
      orgID: ['', Validators.required]
    });
    this.activatedRoute.params.subscribe(params => {
      this.planID = params.id;
      this.onGetPlanInfo();
      this.onCalculateValue();
    });

    this.getAllOrgList();
    this.getCurrentLoggedInUserDetails();
    this.getPropertyListAccessedToCurrentUser();
  }
  onGetPlanInfo() {
    this.loading.start('23');
    this.skLoading = true;
    this.service.getPlanInfo(this.constructor.name, moduleName.billingModule, this.planID)
      .subscribe((res: any) => {
        this.loading.stop('23');
        this.skLoading = false;
        if (res.status === 200) {
          const result = res.response.length > 0 ? res.response[0] : null;
          this.planName = result.plan_name;
          this.totalLicence = result.total_licence;
          this.productName = result.planDetails.product_name;
          this.assigneLicence = result.assigned_licence;
          // this.pl = result.planDetails.type;
        }
        this.onGetAssingedOrg();
      }, error => {
        this.skLoading = false;
        this.loading.stop('23');
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
      });
  }


  onCalculateValue() {
    const cal = Math.ceil(this.assigneLicence * 100 / this.totalLicence);
    this.percents = {
      assigneLicence: cal,
      totalLicence: 100 - cal
    }

  }

  get f() {
    return this.orgForm.controls;
  }

  onGetPropsAndOrgId() {
    this.orgservice.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.currentManagedOrgID = response.organization_id || response.response.oid;
        this.currrentManagedPropID = response.property_id || response.response.id;
      } else {
        this.currentManagedOrgID = this.queryOID;
        this.currrentManagedPropID = this.queryPID;
      }
    });
  }

  getAllOrgList() {
    this.loading.start('3');
    this.service.getAllOrgList(this.constructor.name, moduleName.billingModule)
      .subscribe((res: any) => {
        this.loading.stop('3');
        // this.orgList = res.response;

        this.allUnSignOrgList = [];
        for (const orgObj of res.response) {
          this.allUnSignOrgList.push({label: orgObj.orgname, value: orgObj.id})
        }
        this.search
      }, err => {
        this.loading.stop('3');
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      })
  }

  onGetAssingedOrg() {
    this.loading.start();
    this.skLoading = true;
    this.service.getAssignedOrgByPlanID(this.constructor.name, moduleName.billingModule, this.planID).subscribe((res: any) => {
      this.loading.stop();
      this.skLoading = false;
      this.assigneLicence = res.response.length;
      this.orgList = res.response;
      this.onCalculateValue();
      this.getAvailableLimitByOrgID();
    }, err => {
      this.loading.stop();
      this.skLoading = false;
      this.isOpen = true;
      this.alertMsg = err;
      this.alertType = 'danger';
    })
  }


  openModal(template: TemplateRef<any>) {
    this.orgNameError=false
    this.modalRef = this.modalService.show(template);
    this.orgForm.reset();
  }

  selected($e) {
    $e.preventDefault();
    // this.selectedItems.push($e.item);
    // this.inputEl.nativeElement.value = '';
  }

  onSubmit() {
    this.submitted = true;
    this.orgNameError = !this.orgForm.value.orgID ? true : false;
    // stop here if form is invalid
    if (this.orgForm.invalid) {
      return;
    }
    const payload = {
      planID: this.planID,
      orgID: this.orgForm.value.orgID
    }
    this.loading.start();
    this.skLoading = true;
    this.service.assignOrgLicence(this.constructor.name, moduleName.billingModule, payload)
      .subscribe(res => {
        this.loading.stop();
        this.skLoading = false;
        this.modalRef.hide();
        // this.licenseAvailabilityForFormAndRequestPerOrg(this.orgForm.value.orgID);
        this.orgForm.reset()
        this.onGetAssingedOrg()
        this.getAllOrgList();
        this.isCurrentPropertySelected(this.currentManagedOrgID, this.currrentManagedPropID)
        this.dataService.isLicenseApplied.next({ requesttype: 'organization', hasaccess: true });
      }, err => {
        this.loading.stop();
        this.skLoading = false;
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      })
    // display form values on success
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 0 ? []
        : this.allUnSignOrgList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  async isCurrentPropertySelected(orgID, propID) {
    this.loading.start('2');
    this.dataService.getOrgPlanInfo(this.constructor.name, moduleName.cookieConsentModule, orgID)
      .subscribe((res: any) => {
        this.loading.stop('2');
        this.dataService.setOrgPlanToLocalStorage(res);
      }, error => {
        this.loading.stop('2');
      });
    this.loading.start('1');
    this.dataService.getPropertyPlanDetails(this.constructor.name, moduleName.cookieConsentModule, propID)
      .subscribe((res: any) => {
        this.dataService.setPropertyPlanToLocalStorage(res);
        this.loading.stop('1');
      }, err => {
        this.loading.stop('1');
      });
  }

  onRemoveOrg(oID) {
    this.loading.start();
    this.skLoading = true;
    if(this.isUserHasAccessForAction(oID)){
    this.service.removeOrg(this.constructor.name, moduleName.billingModule, {orgID: oID})
      .subscribe((res: any) => {
        this.loading.stop();
        this.skLoading = false;
        this.modalRef.hide();
        this.onGetAssingedOrg()
        this.isOpen = true;
        this.alertMsg = res.response;
        this.alertType = 'info';
        this.getAllOrgList();
        this.isCurrentPropertySelected(this.currentManagedOrgID, this.currrentManagedPropID);
        this.dataService.isLicenseApplied.next({ requesttype: 'organization', hasaccess: false });
      }, err => {
        this.skLoading = false;
        this.loading.stop();
        this.modalRef.hide();
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      })
    }else{
      this.loading.stop();
      this.skLoading = false;
      this.isOpen = true;
      this.modalRef.hide();
      this.alertMsg = "You are not authorized to access this functionality. Please contact your Administrator";
      this.alertType = 'danger';
    }
  }

  decline(): void {
    this.modalRef.hide();
  }

  getAvailableLimitByOrgID(){
    for(const key of this.orgList){
        this.planUsageByOrgid.length = 0
        const result = this.dataService.checkLicenseAvailabilityPerOrganization(key.id).subscribe(results => {
    this.licenseAvailabilityObj = {
        ...results[0].response,
        ...results[1].response,
        ...results[2].response,
        organizationID : key.id
      }
    this.planUsageByOrgid.push(this.licenseAvailabilityObj);
    this.dataService.setAvailableLicenseForFormAndRequestPerOrg(this.licenseAvailabilityObj);
    }, (error) => {
      console.log(error)
    });
  }

  this.planUsageByOrgid
  }
 // use to fill background of progressbar
  limitUsedVsAvailable(usedLimit,currentLimit):number{
    if(currentLimit === -1){
      return Math.ceil(usedLimit / currentLimit * -1);
    } else if(currentLimit >= 250000) {
      return Math.ceil((usedLimit / currentLimit) * 100000);
    } else {
       return usedLimit > 0 ? Math.ceil(usedLimit / currentLimit * 100) : 0;
    }
  }

  getCurrentLoggedInUserDetails(){
    this.userService.getLoggedInUserDetails(this.constructor.name, moduleName.manageSubscriptionsModule).subscribe((res: any) => {
      if (res.status === 200) {
        this.loggedInuserDetails = res.response;
      }
   });
  }

  getPropertyListAccessedToCurrentUser(){
    this.orgservice.getOrganizationWithProperty().subscribe((data)=>{
      if(data !== undefined && data.response !== undefined && data.response[0].property !== undefined){
        this.currentUserOrganizationList = data.response;
      }
    })
  }

  isUserHasAccessForAction(oID):boolean {
    if(this.loggedInuserDetails.role === "Organization Administrator"){
      const isOIDExists = this.currentUserOrganizationList.some((t)=>t.id === oID);
      if(isOIDExists){
        return true
      }else{
        return false;
      }
    }else{
      return true; // For users other than "Organization Administrator"
    }
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  ngOnDestroy() {
    // this.modalRef.hide();

  }
}
