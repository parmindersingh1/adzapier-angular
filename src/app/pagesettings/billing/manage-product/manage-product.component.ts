import { TemplateRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';
import { moduleName } from 'src/app/_constant/module-name.constant';
import { BillingService } from 'src/app/_services/billing.service';
import { OrganizationService } from 'src/app/_services/organization.service';
let propertyList = [];
@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {
  planID = '';
  propertyName: any;
  propertyNameError = false;
  submitted = false;
  private currentManagedOrgID: any;
  private currrentManagedPropID: any;

  planName = '';
  totalLicence = 0;
  assigneLicence = 0;
  propertyForm: FormGroup;

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
              private orgservice: OrganizationService

    ) { }

  ngOnInit(

  ) {
    this.onGetPropsAndOrgId();
    this.propertyForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.planID = params.planid;
      this.planName = params.plan_name;
      this.totalLicence = params.total_licence;
      this.assigneLicence = params.assigned_licence;
      this.onGetAssingedProperty();
      this.onCalculateValue()
    })
    this.onGetAllPropertyList();
  }
  onCalculateValue() {
    const cal = Math.ceil(this.assigneLicence * 100 / this.totalLicence);
    this.percents = {
      assigneLicence: cal,
      totalLicence: 100 - cal
    }

  }
  get f() { return this.propertyForm.controls; }

  onGetAllPropertyList(){
    this.loading.start('2');
    this.service.getAllPropertyList(this.constructor.name, moduleName.billingModule)
    .subscribe((res: any) => {
      this.loading.stop('2');
      this.allPropertyList = res.response;
      propertyList = [];
      for(const propertyObj of res.response) {
        propertyList.push(propertyObj.name)
      }
      this.search
    }, err => {
      this.loading.stop('2');
    })
  }

  onGetAssingedProperty() {
    this.loading.start();
    this.skLoading = true;
    this.service.getAssignedLicenseByPropsID(this.constructor.name, moduleName.billingModule, this.planID).subscribe( (res: any) => {
      this.loading.stop();
      this.skLoading = false;
      this.assigneLicence = res.response.length;
      this.propertyList = res.response;
      this.onCalculateValue();
    })
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

    // stop here if form is invalid
    if (this.propertyForm.invalid) {
        return;
    }
    let pID = '';
    for(const propertyObj of this.allPropertyList) {
      if(propertyObj.name === this.propertyName) {
        pID = propertyObj.id;
      }
    }

    if(pID === '') {
      this.propertyNameError = true;
    } else {
      this.propertyNameError = false;
    const payloads = {
      planID : this.planID,
      pID: pID
    }
    this.loading.start();
    this.service.assignPropertyLicence(this.constructor.name, moduleName.billingModule, payloads)
    .subscribe(res => {
      this.loading.stop();
      this.modalRef.hide();
      this.propertyForm.reset()
      this.onGetAssingedProperty()
      this.onGetAllPropertyList()
    }, err => {
      this.loading.stop();
    })
  }
    // display form values on success
}

  search = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 0 ? []
      : propertyList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )

  onRemoveProperty(pID){
    this.loading.start();
    this.service.removeProperty(this.constructor.name, moduleName.billingModule, {pID: pID})
    .subscribe(res => {
      this.loading.stop();
      this.onGetAssingedProperty()
      this.onGetAllPropertyList()
    }, err => {
      this.loading.stop();
    })
  }

}
