import { OnDestroy } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';
import { moduleName } from 'src/app/_constant/module-name.constant';
import { BillingService } from 'src/app/_services/billing.service';
import { DataService } from 'src/app/_services/data.service';
import { OrganizationService } from 'src/app/_services/organization.service';

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
  constructor(private service: BillingService,
               private modalService: BsModalService,
              private activatedRoute: ActivatedRoute,
              private loading: NgxUiLoaderService,
              private formBuilder: FormBuilder,
              private dataService: DataService

    ) { }

  ngOnInit(

  ) {
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
  get f() { return this.orgForm.controls; }

  getAllOrgList(){
    this.loading.start('3');
    this.service.getAllOrgList(this.constructor.name, moduleName.billingModule)
    .subscribe((res: any) => {
      this.loading.stop('3');
      // this.orgList = res.response;

      this.allUnSignOrgList = [];
      for(const orgObj of res.response) {
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
    this.service.getAssignedOrgByPlanID(this.constructor.name, moduleName.billingModule, this.planID).subscribe( (res: any) => {
      this.loading.stop();
      this.skLoading = false;
      this.assigneLicence = res.response.length;
      this.orgList = res.response;
      this.onCalculateValue();
    }, err => {
      this.loading.stop();
      this.skLoading = false;
      this.isOpen = true;
      this.alertMsg = err;
      this.alertType = 'danger';
    })
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  selected($e) {
    $e.preventDefault();
    // this.selectedItems.push($e.item);
    // this.inputEl.nativeElement.value = '';
  }

  onSubmit() {
    this.submitted = true;
    console.log('this.orgForm.value.orgID', this.orgForm.value.orgID)
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
      this.licenseAvailabilityForFormAndRequestPerOrg(this.orgForm.value.orgID);
      this.orgForm.reset()
      this.onGetAssingedOrg()

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

  onRemoveOrg(oID){
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

  ngOnDestroy() {
    // this.modalRef.hide();

  }
}
