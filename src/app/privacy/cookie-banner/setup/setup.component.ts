import { Component, OnInit } from '@angular/core';
import { notificationConfig } from '../../../_constant/notification.constant';
import { NotificationsService } from 'angular2-notifications';
import { CookieBannerService } from '../../../_services/cookie-banner.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OrganizationService } from '../../../_services';
import { Location } from '@angular/common';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  private currentManagedOrgID: any;
  private currrentManagedPropID: any;
  scriptUrl: any;
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  constructor(
    private notification: NotificationsService,
    private cookieBannerService: CookieBannerService,
    private loading: NgxUiLoaderService,
    private orgservice: OrganizationService,
  ) { }

  ngOnInit() {
    this.onGetPropsAndOrgId();
    this.onGetCookieBannerData();
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

  onGetCookieBannerData() {
    this.loading.start('2');
    this.cookieBannerService.onGetCookieBannerData(this.currentManagedOrgID , this.currrentManagedPropID, this.constructor.name)
      .subscribe(res => {
        this.loading.stop('2');
        this.scriptUrl = `<script src="https://${res['response']['js_location']}"></script>`;
        if (res['status'] === 200 && res.hasOwnProperty('response')) {
        }
      }, error => {
        this.loading.stop('2');
        this.notification.error('Error', error, notificationConfig);
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
      });
  }
  onCopyScript() {
    this.scriptUrl.select();
    document.execCommand('copy');
    this.scriptUrl.setSelectionRange(0, 0);
  }
}
