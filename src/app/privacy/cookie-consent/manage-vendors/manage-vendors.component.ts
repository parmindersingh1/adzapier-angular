import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GdprService} from '../../../_services/gdpr.service';
import {CookieBannerService} from '../../../_services/cookie-banner.service';
import {OrganizationService} from '../../../_services';
import {moduleName} from '../../../_constant/module-name.constant';
import {NgxUiLoaderService} from 'ngx-ui-loader';

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
  iabVendorsID: any = [];
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
  private currentManagedOrgID: any;
  private currrentManagedPropID: any;
  searchIabVendors: any[] = [];
  searchGoogleVendors: any[] = [];

  constructor(
    private orgservice: OrganizationService,
    private gdprService: GdprService,
    private loading: NgxUiLoaderService,
    private cookieBanner: CookieBannerService
  ) {
  }

  ngOnInit() {
    this.onGetPropsAndOrgId();
    this.getAllVendorsData();
    this.onGetAllowVendors();
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

  async getAllVendorsData() {
    this.skeletonLoading.one = true;
    this.vendorsList = await this.gdprService.getAllData();
    this.iabVendorsList = Object.values(this.vendorsList.vendors);

    // console.log('vendorsList', Object.values(this.vendorsList.vendors))
    // const vendorsList = [];
    // for (const  vendor of Object.values(this.vendorsList.vendors)) {
    //   vendorsList.push({label: vendor['name'], value: vendor['id']});
    // }
    // this.gdprService.getIabCustomVendors().subscribe((res: any) => {
    //   this.vendorsList = res;
    //   this.iabVendorsList = Object.values(this.vendorsList.vendors);
    // });

    this.skeletonLoading.one = false;
    this.skeletonLoading.one = true;
    this.gdprService.getGoogleVendors().subscribe((res: any[]) => {
      this.skeletonLoading.one = false;
      // const googleVendorsList = [];
      // for (const  vendor of res) {
      //   googleVendorsList.push({label: vendor['provider_name'], value: vendor['provider_id']});
      // }
      this.googleVendorsList = res;
    })

  }

  onGetAllowVendors() {
    this.loading.start();
    this.skeletonLoading.two = true;
    this.isOpen = false;
    this.cookieBanner.onGetVendorsData(this.currentManagedOrgID, this.currrentManagedPropID, this.constructor.name, moduleName.manageVendorsModule)
      .subscribe(res => {
        this.skeletonLoading.two = false;
        this.loading.stop();
        if (res.status === 200) {
          const result = res.response;
          this.googleVendorsID = JSON.parse(result.google_vendors);
          this.iabVendorsID = JSON.parse(result.iab_vendors);
        }
        this.isOpen = true;
        this.alertMsg = res.message;
        this.alertType = 'success';
      }, error => {
        this.skeletonLoading.two = false;
        this.loading.stop();
        this.isOpen = true;
        this.alertMsg = error.message;
        this.alertType = 'danger';
      })
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
        this.iabVendorsID.push(iabObj.id)
      }
    } else {
      this.iabVendorsID = [];
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

  onUpdateVendors() {
    const payloads = {
      iab_vendors: JSON.stringify(this.iabVendorsID),
      google_vendors: JSON.stringify(this.googleVendorsID)
    };
    this.loading.start();
    this.updating = true;
    this.isOpen = false;
    this.cookieBanner.updateVendors(payloads, this.currentManagedOrgID, this.currrentManagedPropID, this.constructor.name, moduleName.manageVendorsModule)
      .subscribe((res: any) => {
        this.loading.stop();
        this.updating = false;
        if (res.status === 201) {
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


}


