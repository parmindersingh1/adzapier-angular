import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { CookieBannerService } from '../../../../_services/cookie-banner.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OrganizationService } from '../../../../_services';
import { Location } from '@angular/common';
import {moduleName} from '../../../../_constant/module-name.constant';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import { environment } from 'src/environments/environment';
import { apiConstant } from 'src/app/_constant/api.constant';


@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  private currentManagedOrgID: any;
  env = environment;
  apiConstant = apiConstant;
  modalRef: BsModalRef;
  isCopied = {
    one: false,
    two: false
  };
  private currrentManagedPropID: any;
  @ViewChild('template', { static: true}) template: ElementRef;
  closeScript = `"></script>`;
  addScript = `<script src="`;
  tagEle = {
    openHead: '<head>',
    closeHead: '</head>',
    openScript: '<script>',
    closeScript: '</script>'
  }
  loadingSkeleton = false;
  scriptUrl: any;
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  constructor(
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
    this.isCopied.one = true;
    const copyText: any = `<script>
    // Replace Your AuthId '123123123'
    document.cookie = "authId=123123123";
    </script> ` +
     this.addScript + '//' + this.scriptUrl + this.closeScript;
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

  onClosed(alertMsg: any) {

  }

  copyToClipboardMethod() {
    this.isCopied.two = true;
    const copyText: any = `<script>
    // Execute the method for open Preferences
    window.AzCMP.onOpenPopUp();
    </script> `;
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
}
