import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {moduleName} from 'src/app/_constant/module-name.constant';
import {BillingService} from 'src/app/_services/billing.service';
import {OrganizationService} from 'src/app/_services/organization.service';
import {DataService} from '../../../../_services/data.service';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-property.component.html',
  styleUrls: ['./manage-property.component.scss']
})
export class ManagePropertyComponent implements OnInit, OnDestroy {
  planID = '';
  propertyName: any;
  propertyNameError = false;
  submitted = false;
  private currentManagedOrgID: any;
  private currrentManagedPropID: any;
  delPropID: any;

  planName = '';

  totalLicence = 0;
  assigneLicence = 0;
  productName = '';
  propertyForm: FormGroup;
  allUnSignPropertyList = [];
  orgList = [];
  percents = {
    totalLicence: 0,
    assigneLicence: 0
  }
  alertMsg: any;
  isOpen = false;
  alertType: any;

  modalRef: BsModalRef;
  @ViewChild('delConfirm', {static: false}) delConfirm;
  skLoading = true;
  propertyList = [];
  allPropertyList = [];

  constructor(private service: BillingService,
              private modalService: BsModalService,
              private activatedRoute: ActivatedRoute,
              private loading: NgxUiLoaderService,
              private formBuilder: FormBuilder,
              private orgservice: OrganizationService,
              private dataService: DataService
  ) {
  }

  ngOnInit() {
    this.onGetPropsAndOrgId()
    this.propertyForm = this.formBuilder.group({
      propID: ['', Validators.required]
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.planID = params.planid;
      this.planName = params.plan_name;
      this.totalLicence = params.total_licence;
      this.productName = params.product_name;
      this.assigneLicence = params.assigned_licence;
      this.onGetAssingedProperty();
      this.onCalculateValue();
    })

    this.getAllOrgList();
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

  onCalculateValue() {
    const cal = Math.ceil(this.assigneLicence * 100 / this.totalLicence);
    this.percents = {
      assigneLicence: cal,
      totalLicence: 100 - cal
    }

  }

  get f() {
    return this.propertyForm.controls;
  }

  onGetAllPropertyList(e) {
    const payload = {oID: e.target.value}
    this.loading.start('2');
    this.service.getAllPropertyList(this.constructor.name, moduleName.billingModule, payload)
      .subscribe((res: any) => {
        this.loading.stop('2');
        // this.allPropertyList = res.response;
        this.allUnSignPropertyList = [];
        for (const propertyObj of res.response) {
          this.allUnSignPropertyList.push({label: propertyObj.name, value: propertyObj.id})
        }
        this.search
      }, err => {
        this.loading.stop('2');
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      })
  }

  getAllOrgList() {
    this.loading.start('3');
    this.service.getAllActiveOrgList(this.constructor.name, moduleName.billingModule)
      .subscribe((res: any) => {
        this.loading.stop('3');
        this.orgList = res.response;
      }, err => {
        this.loading.stop('3');
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      })
  }

  onGetAssingedProperty() {
    this.loading.start();
    this.skLoading = true;
    this.service.getAssignedPropByPlanID(this.constructor.name, moduleName.billingModule, this.planID).subscribe((res: any) => {
      this.loading.stop();
      this.skLoading = false;
      this.assigneLicence = res.response.length;
      this.propertyList = res.response;
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

  async onSubmit() {
    this.submitted = true;
    this.propertyNameError = this.propertyForm.value.propID.length > this.totalLicence - this.assigneLicence ? true : false;
    // stop here if form is invalid
    if (this.propertyForm.invalid) {
      return;
    }
    const payload = {
      planID: this.planID,
      propID: this.propertyForm.value.propID
    }
    this.loading.start();

    this.skLoading = true;
    this.service.assignPropertyLicence(this.constructor.name, moduleName.billingModule, payload)
      .subscribe((res: any) => {
        this.loading.stop();
        this.skLoading = false;
        this.modalRef.hide();
        this.isOpen = true;
        this.alertMsg = res.response;
        this.alertType = 'success';
        this.propertyForm.reset()
        this.onGetAssingedProperty()
        this.isCurrentPropertySelected(this.currentManagedOrgID, this.currrentManagedPropID);

      }, err => {
        this.loading.stop();
        this.skLoading = false;
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      })
    // display form values on success
  }

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

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 0 ? []
        : this.allUnSignPropertyList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  onRemoveProperty(pID) {
    this.loading.start();
    this.skLoading = true;
    this.service.removeProperty(this.constructor.name, moduleName.billingModule, {pID: pID})
      .subscribe((res: any) => {
        this.loading.stop();
        this.modalRef.hide();
        this.skLoading = false;
        this.onGetAssingedProperty()
        this.isOpen = true;
        this.alertMsg = res.response;
        this.alertType = 'success';
        this.isCurrentPropertySelected(this.currentManagedOrgID, this.currrentManagedPropID);

      }, err => {
        this.loading.stop();
        this.skLoading = false;
        this.isOpen = true;
        this.modalRef.hide();
        this.alertMsg = err;
        this.alertType = 'danger';
      })
  }

  decline(): void {
    this.modalRef.hide();
  }

  onCheckAvailableLic(e) {
    console.log('EEEEEEEEEEEEE', e)
  }

  ngOnDestroy() {
    // this.modalRef.hide();
  }
}
