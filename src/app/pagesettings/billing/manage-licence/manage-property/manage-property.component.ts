import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {moduleName} from 'src/app/_constant/module-name.constant';
import { UserService } from 'src/app/_services';
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
  oID = '';
  propertyName: any;
  propertyNameError = false;
  submitted = false;
  licensesPropertyIDs = [];
  private currentManagedOrgID: any;
  private currrentManagedPropID: any;
  delPropID: any;
  planType: any;
  propertlyLicensesID: any;

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
  };
  alertMsg: any;
  isOpen = false;
  alertType: any;

  modalRef: BsModalRef;
  @ViewChild('delConfirm') delConfirm;
  skLoading = true;
  propertyList = [];
  allPropertyList = [];
  queryOID;
  queryPID;
  constructor(private service: BillingService,
              private modalService: BsModalService,
              private activatedRoute: ActivatedRoute,
              private loading: NgxUiLoaderService,
              private formBuilder: FormBuilder,
              private orgservice: OrganizationService,
              private dataService: DataService,
              private userService: UserService
  ) {
  }

  ngOnInit() {
    this.onGetPropsAndOrgId();
    this.propertyForm = this.formBuilder.group({
      propID: ['', Validators.required]
    });
    this.activatedRoute.params.subscribe(params => {
      if(params.id.indexOf("?") == -1){
        this.planID = params.id;
      }else{
        let extractplanID = params.id.split("?");
        this.planID = extractplanID[0];
      }
      // this.planName = params.plan_name;
      // this.totalLicence = params.total_licence;
      // this.productName = params.product_name;
      // this.assigneLicence = params.assigned_licence;
      // this.planType = params.type;
      this.onGetPlanInfo();
      // this.onGetAssingedProperty();
      this.onCalculateValue();
    });

    this.activatedRoute.queryParamMap
      .subscribe(params => {
      this.queryOID = params.get('oid');
      this.queryPID = params.get('pid');
    });
    this.getAllOrgList();
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
          this.planType = result.planDetails.type;
        }
        this.onGetAssingedProperty();
      }, error => {
        this.skLoading = false;
        this.loading.stop('23');
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
      });
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

  onCalculateValue() {
    const cal = Math.ceil(this.assigneLicence * 100 / this.totalLicence);
    this.percents = {
      assigneLicence: cal,
      totalLicence: 100 - cal
    };

  }

  get f() {
    return this.propertyForm.controls;
  }

  onGetAllPropertyList(e) {
    // this.onGetAllPropertyLicenseList(e);
    this.oID = e.target.value;
    const payload = {oID: e.target.value, planID: this.planID, planType: String(this.planType)};
    this.loading.start('2');
    this.service.getAllPropertyList(this.constructor.name, moduleName.billingModule, payload)
      .subscribe((res: any) => {
        this.loading.stop('2');
        // this.allPropertyList = res.response;
        // const pid = [];
        // for (const property of this.propertyList) {
        //   pid.push(property.id);
        // }
        // this.allUnSignPropertyList = [];
        // for (const propertyObj of res.response) {
        //   if (!pid.includes(propertyObj.id)) {
        //     this.allUnSignPropertyList.push({label: propertyObj.name, value: propertyObj.id})
        //   }
        // }
        // this.search
        // this.allPropertyList = res.response;
        this.onGetAllPropertyLicenseList(e, res);
      }, err => {
        this.loading.stop('2');
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      });
  }

  onGetAllPropertyLicenseList(e, res) {
    const payload = {oID: e.target.value, licenseType: String(this.planType)};
    this.loading.start('3');
    this.service.getAllPropertyLicenseList(this.constructor.name, moduleName.billingModule, payload)
      .subscribe((result: any) => {
        this.loading.stop('3');

        const propertyList = [...res.response];
        const assignedLicenseProperty = [];

        for (const assignedProperty of result.response) {
           assignedLicenseProperty.push(assignedProperty.pid);
         }

        this.allUnSignPropertyList = [];
        for (const propertyObj of propertyList) {
          if (!assignedLicenseProperty.includes(propertyObj.id)) {
            this.allUnSignPropertyList.push({label: propertyObj.name, value: propertyObj.id});
          }
        }
        this.search;
        // this.allPropertyList = res.response;
      }, err => {
        this.loading.stop('3');
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      });
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
      });
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

  async onSubmit() {
    this.submitted = true;
    this.propertyNameError = this.propertyForm.value.propID.length > this.totalLicence - this.assigneLicence ? true : false;
    // stop here if form is invalid
    if (this.propertyForm.invalid) {
      return;
    }
    const payload = {
      planID: this.planID,
      propID: this.propertyForm.value.propID,
      orgID: this.oID,
      planType: String(this.planType)
    };
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
        this.propertyForm.reset();
        this.onGetAssingedProperty();
        this.dataService.isLicenseAppliedForProperty.next({ requesttype: 'property', hasaccess: true });
        this.isCurrentPropertySelected(this.currentManagedOrgID, this.currrentManagedPropID);

      }, err => {
        this.loading.stop();
        this.skLoading = false;
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      });
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
        this.dataService.removePropertyPlanFromLocalStorage();
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
    this.service.removeProperty(this.constructor.name, moduleName.billingModule, {properly_licenses_id: this.propertlyLicensesID,
      pID,
      planID: this.planID
    })
      .subscribe((res: any) => {
        this.loading.stop();
        this.modalRef.hide();
        this.skLoading = false;
        this.onGetAssingedProperty();
        this.isOpen = true;
        this.alertMsg = res.response;
        this.alertType = 'success';
        this.dataService.isLicenseAppliedForProperty.next({ requesttype: 'property', hasaccess: false });
        this.isCurrentPropertySelected(this.currentManagedOrgID, this.currrentManagedPropID);

      }, err => {
        this.loading.stop();
        this.skLoading = false;
        this.isOpen = true;
        this.modalRef.hide();
        this.alertMsg = err;
        this.alertType = 'danger';
      });
  }

  decline(): void {
    this.modalRef.hide();
  }

  onCheckAvailableLic(e) {
  }

  ngOnDestroy() {
    // this.modalRef.hide();
  }
}
