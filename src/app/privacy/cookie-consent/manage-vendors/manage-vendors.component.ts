import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {GdprService} from '../../../_services/gdpr.service';
import {CookieBannerService} from '../../../_services/cookie-banner.service';
import {OrganizationService} from '../../../_services';
import {moduleName} from '../../../_constant/module-name.constant';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {featuresName} from '../../../_constant/features-name.constant';
import {DataService} from '../../../_services/data.service';
import {LazyLoadEvent} from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { findPropertyIDFromUrl } from 'src/app/_helpers/common-utility';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-manage-vendors',
  templateUrl: './manage-vendors.component.html',
  styleUrls: ['./manage-vendors.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ManageVendorsComponent implements OnInit {
  vendorsList: any = [];
  googleVendorsList: any = [];
  googleVendorsID: any = [];
  googleVendorsDefaultID: any = [];
  iabVendorsID: any = [];
  iabVendorsDefaultID: any = [];
  iabVendorsList = [];
  skeletonLoading = {
    one: true,
    two: true
  };
  updating = false;

  dismissible = true;
  alertMsg: any;
  isEdit = false;
  isOpen = false;
  alertType: any;
  planDetails: any;
  private currentManagedOrgID: any;
  private currrentManagedPropID: any;
  searchIabVendors: any[] = [];
  searchGoogleVendors: any[] = [];
  modalRef: BsModalRef;
  actionType = 'active';
  isFeatureAvaliable = false;
  isAlliavinactive = true;
  isAllgoogleinactive = true;
  showVendorType = 1;
  queryOID;
  queryPID;
  oIDPIDFromURL:any = [];
  tooltips = "Select all";
  constructor(
    private orgservice: OrganizationService,
    private gdprService: GdprService,
    private loading: NgxUiLoaderService,
    private activateRoute: ActivatedRoute,
    private modalService: BsModalService,
    private cookieBanner: CookieBannerService,
    private dataService: DataService,
    private location: Location,
    private cd: ChangeDetectorRef,
    private titleService: Title 

  ) {

    this.titleService.setTitle("Manage Vendors - Adzapier Portal");

  }

  ngOnInit() {
    this.activateRoute.queryParams
      .subscribe((params: any) => {
        this.queryOID = params.oid;
        this.queryPID = params.pid;
      });
    this.onGetPropsAndOrgId();
    this.getAllVendorsData();
    this.onCheckSubscription();
  }


    onCheckSubscription() {
      const resData: any = this.dataService.getCurrentPropertyPlanDetails();
      const status = this.dataService.isAllowFeatureByYes(resData.response, featuresName.MANAGE_VENDORS);
      this.isFeatureAvaliable = status;
      if (!this.isFeatureAvaliable) {
        this.onCheckAllowBannerConfig();
      }
    }

  onCheckAllowBannerConfig() {
    this.planDetails = this.dataService.getCurrentPropertyPlanDetails();
    if (!this.isFeatureAvaliable) {
      this.dataService.openSubcriptionModalForRestrication(this.planDetails);
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md'});
  }

  onGetPropsAndOrgId() {
    this.cd.markForCheck();
    this.orgservice.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.currentManagedOrgID = response.organization_id || response.response.oid || this.queryOID;
        this.currrentManagedPropID = response.property_id || response.response.id || this.queryPID;
      } else {
        this.oIDPIDFromURL = findPropertyIDFromUrl(this.location.path());
        this.currentManagedOrgID = this.queryOID || this.oIDPIDFromURL[0];
        this.currrentManagedPropID = this.queryPID || this.oIDPIDFromURL[1];
      }
    });
  }

  async getAllVendorsData() {
    this.skeletonLoading.one = true;
    this.vendorsList = await this.gdprService.getAllData();
    this.iabVendorsList = Object.values(this.vendorsList.vendors);

    this.skeletonLoading.one = false;
    this.skeletonLoading.one = true;
    this.gdprService.getGoogleVendors().subscribe((res: any[]) => {
      this.skeletonLoading.one = false;
      this.googleVendorsList = res;
      this.onGetAllowVendors();
    });

  }

  onGetAllowVendors() {
    this.loading.start();
    this.skeletonLoading.two = true;
    this.isOpen = false;
    this.cookieBanner.onGetVendorsData(this.queryOID, this.queryPID, this.constructor.name, moduleName.manageVendorsModule)
      .subscribe(res => {
        this.skeletonLoading.two = false;
        this.loading.stop();
        if (res) {
          if (res.status === 200) {
            const result = res.response;
            this.googleVendorsDefaultID = JSON.parse(result.google_vendors);
            this.iabVendorsDefaultID = JSON.parse(result.iab_vendors);
            this.cd.detectChanges();
          }
        } else {
          this.onAllowAllVendors();
        }
      }, error => {
        this.skeletonLoading.two = false;
        this.loading.stop();
        this.isOpen = true;
        this.alertMsg = error.message;
        this.alertType = 'danger';
      })
  }
  onAllowAllVendors() {
    const googleVendorsID = [...this.googleVendorsDefaultID];
    const iabVendorsID = [...  this.iabVendorsDefaultID];
    if (this.googleVendorsDefaultID.length === 0) {
      for (const googleVendor of this.googleVendorsList) {
        googleVendorsID.push(googleVendor.provider_id);
      }
    }
    if (this.iabVendorsDefaultID.length === 0) {
      for (const iabVendor of this.iabVendorsList) {
        iabVendorsID.push(iabVendor.id);
      }
    }
    this.googleVendorsDefaultID = googleVendorsID;
    this.iabVendorsDefaultID = iabVendorsID;
    this.cd.detectChanges()
  }
  onSelectGoogleVendor(event, id) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.googleVendorsID.push(id)
    } else {
      const index = this.googleVendorsID.indexOf(id);
      if (index > -1) {
        this.googleVendorsID.splice(index, 1);
      }
    }
  }

  onSelectIabVendor(event, id) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.iabVendorsID.push(id)
    } else {
      const index = this.iabVendorsID.indexOf(id);
      if (index > -1) {
        this.iabVendorsID.splice(index, 1);
      }
    }
  }

  onAllowAllIabVendor(event) {
    const isChecked = event.target.checked;
    this.iabVendorsID = [];
    if (isChecked) {
      for (const iabObj of this.iabVendorsList) {
        this.iabVendorsID.push(iabObj.id);
        this.tooltips="Clear all";
      }
    } else {
      this.iabVendorsID = [];
      this.tooltips="Select all";
    }
  }


  onAllowAllGoogleVendor(event) {
    const isChecked = event.target.checked;
    this.googleVendorsID = [];
    if (isChecked) {
      for (const iabObj of this.googleVendorsList) {
        this.googleVendorsID.push(iabObj.provider_id)
      }
    } else {
      this.googleVendorsID = [];
    }
  }

  onUpdateVendors(iabVendorsID, googleVendorsID) {
    const payloads = {
      iab_vendors: JSON.stringify(iabVendorsID),
      google_vendors: JSON.stringify(googleVendorsID)
    };
    this.loading.start();
    this.updating = true;
    this.isOpen = false;
    this.cookieBanner.updateVendors(payloads, this.currentManagedOrgID, this.currrentManagedPropID, this.constructor.name, moduleName.manageVendorsModule)
      .subscribe((res: any) => {
        this.loading.stop();
        this.updating = false;
        if (res.status === 201) {
          this.iabVendorsID = [];
          this.googleVendorsID = [];
          this.onGetAllowVendors();
        }
        this.isOpen = true;
        this.alertMsg = res.message;
        this.alertType = 'success';
      }, error => {
        this.updating = false;
        this.loading.stop();
        this.isOpen = true;
        this.alertMsg = error.message;
        this.alertType = 'danger';
      })
  }

  onSearchIabVendors(e) {
    const searchText = e.target.value;
    this.searchIabVendors = [];
    for (const obj of Object.values(this.iabVendorsList)) {
      if (obj['name'].toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
        this.searchIabVendors.push(obj);
      }
    }
  }


  onSearchGoogleVendors(e) {
    const searchText = e.target.value;
    this.searchGoogleVendors = [];
    for (const obj of Object.values(this.googleVendorsList)) {
      if (obj['provider_name'].toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
        this.searchGoogleVendors.push(obj);
      }
    }
  }


  confirm(): void {
    if (!this.isFeatureAvaliable) {
      this.onCheckAllowBannerConfig();
    } else {
      if (this.actionType === 'active') {
        const iabVendors = this.iabVendorsDefaultID.concat(this.iabVendorsID);
        const googleVendors = this.googleVendorsDefaultID.concat(this.googleVendorsID);
        this.onUpdateVendors(iabVendors, googleVendors)
      } else {
        const iabVendorsID = this.iabVendorsDefaultID.filter(item => !this.iabVendorsID.includes(item));
        const googleVendorsID = this.googleVendorsDefaultID.filter(item => !this.googleVendorsID.includes(item));
        this.onUpdateVendors(iabVendorsID, googleVendorsID)
      }
      this.decline();
    }
  }


  decline(): void {
    this.modalRef.hide();
  }


  loadIabVendorsLazy(event: LazyLoadEvent) {

    setTimeout(() => {
      const iabVendors = this.iabVendorsList.slice(event.first, (event.first + event.rows));
      Array.prototype.splice.apply(this.iabVendorsList, [...[event.first, event.rows], ...iabVendors]);
      this.iabVendorsList = [...this.iabVendorsList];
    }, Math.random() * 1000 + 250);
  }

  loadIabGoogleLazy(event: LazyLoadEvent) {
    setTimeout(() => {
      const googleVendors = this.googleVendorsList.slice(event.first, (event.first + event.rows));
      Array.prototype.splice.apply(this.googleVendorsList, [...[event.first, event.rows], ...googleVendors]);
      this.googleVendorsList = [...this.googleVendorsList];
      this.cd.detectChanges()
    }, Math.random() * 1000 + 250);
  }

}


