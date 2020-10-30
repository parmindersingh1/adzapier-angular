import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { notificationConfig } from '../../../../_constant/notification.constant';
import { NotificationsService } from 'angular2-notifications';
import { CookieBannerService } from '../../../../_services/cookie-banner.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OrganizationService } from '../../../../_services';
import { Location } from '@angular/common';
import {moduleName} from '../../../../_constant/module-name.constant';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Router} from '@angular/router';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  private currentManagedOrgID: any;
  modalRef: BsModalRef;
  isCopied = false;
  private currrentManagedPropID: any;
  @ViewChild('template', { static: true}) template: ElementRef;
  closeScript = `"></script>`;
  addScript = `<script src="`;
  loadingSkeleton = false;
  scriptUrl: any;
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  constructor(
    private notification: NotificationsService,
    private cookieBannerService: CookieBannerService,
    private loading: NgxUiLoaderService,
    private modalService: BsModalService,
    private router: Router,
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
    this.loadingSkeleton = true;
    this.cookieBannerService.onGetCookieBannerData(this.currentManagedOrgID , this.currrentManagedPropID, this.constructor.name, moduleName.setUpModule)
      .subscribe(res => {
        this.loadingSkeleton = false;
        this.loading.stop('2');
        if (res.status === 200 && res.hasOwnProperty('response')) {
          this.scriptUrl = res.response.js_location; this.scriptUrl = res.response.js_location;
        } else {
          this.openModal(this.template);
        }
      }, error => {
        this.loading.stop('2');
        this.loadingSkeleton = false;
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
  copyToClipboard() {
    this.isCopied = true;
    const copyText: any = this.addScript + '//' + this.scriptUrl + this.closeScript;
    let textarea = null;
    textarea = document.createElement('textarea');
    textarea.style.height = '0px';
    textarea.style.left = '-100px';
    textarea.style.opacity = '0';
    textarea.style.position = 'fixed';
    textarea.style.top = '-100px';
    textarea.style.width = '0px';
    document.body.appendChild(textarea);
    textarea.value = copyText.trim();
    textarea.select();
    document.execCommand('copy');
  }

  openModal(template: any) {
    this.modalRef = this.modalService.show(template, { animated: false,    keyboard: false,     ignoreBackdropClick: true
    });
  }

  navigate() {
    this.modalRef.hide();
    this.router.navigateByUrl('/cookie-consent/cookie-banner');
  }
}
