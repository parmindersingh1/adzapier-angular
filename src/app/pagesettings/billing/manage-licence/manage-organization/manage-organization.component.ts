import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {forkJoin, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {moduleName} from 'src/app/_constant/module-name.constant';
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
  constructor(private service: BillingService,
              private modalService: BsModalService,
              private activatedRoute: ActivatedRoute,
              private loading: NgxUiLoaderService,
              private formBuilder: FormBuilder,
              private dataService: DataService,
              private orgservice: OrganizationService
  ) {
  }

  ngOnInit() {
    this.onGetPropsAndOrgId();
    this.orgForm = this.formBuilder.group({
      orgID: ['', Validators.required]
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.planID = params.planid;
      this.planName = params.plan_name;
      this.totalLicence = params.total_licence;
      this.productName = params.product_name;
      this.assigneLicence = params.assigned_licence;
      this.onGetAssingedOrg();
      this.onCalculateValue()
    })

    this.getAllOrgList();
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
        const orgDetails = this.orgservice.getCurrentOrgWithProperty();
        this.currentManagedOrgID = orgDetails.organization_id || orgDetails.response.oid;
        this.currrentManagedPropID = orgDetails.property_id || orgDetails.response.id;
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
        this.isCurrentPropertySelected(this.currentManagedOrgID, this.currrentManagedPropID)

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
    this.service.removeOrg(this.constructor.name, moduleName.billingModule, {orgID: oID})
      .subscribe((res: any) => {
        this.loading.stop();
        this.skLoading = false;
        this.modalRef.hide();
        this.onGetAssingedOrg()
        this.isOpen = true;
        this.alertMsg = res.response;
        this.alertType = 'info';
        this.isCurrentPropertySelected(this.currentManagedOrgID, this.currrentManagedPropID);

      }, err => {
        this.skLoading = false;
        this.loading.stop();
        this.modalRef.hide();
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      })
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

  ngOnDestroy() {
    // this.modalRef.hide();

  }
}
