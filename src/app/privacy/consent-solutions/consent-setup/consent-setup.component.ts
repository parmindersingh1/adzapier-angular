import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {CookieBannerService} from '../../../_services/cookie-banner.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {Router} from '@angular/router';
import {OrganizationService} from '../../../_services';
import {moduleName} from '../../../_constant/module-name.constant';
import { apiConstant } from 'src/app/_constant/api.constant';
import {CompanyService} from '../../../company.service';

@Component({
  selector: 'app-consent-setup',
  templateUrl: './consent-setup.component.html',
  styleUrls: ['./consent-setup.component.scss']
})
export class ConsentSetupComponent implements OnInit {
  private currentManagedOrgID: any;
  env = environment;
  apiConstant = apiConstant;
  modalRef: BsModalRef;
  isCopied = {
    one: false,
    two: false,
    three:false,
  };
  currrentManagedPropID = '';
  @ViewChild('template', { static: true}) template: ElementRef;
  closeScript = `"></script>`;
  addScript = `<script src="`;
  tagEle = {
    openHead: '<head>',
    closeHead: '</head>',
    openScript: '<script>',
    closeScript: '</script>'
  }
  appId = '';
  loadingSkeleton = false;
  scriptUrl = 'https://staging-cdn.adzapsrv.com/consent-preference/develop/cp_sdk.adzapier.js';
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  initData = '';
  constructor(
    private cookieBannerService: CookieBannerService,
    private loading: NgxUiLoaderService,
    private modalService: BsModalService,
    private router: Router,
    private orgservice: OrganizationService,
    private companyService: CompanyService
  ) { }

  ngOnInit() {
    this.onGetPropsAndOrgId();
    this.onGetToken();
  }


  onGetToken() {
    this.loading.start();
    this.companyService.getToken(this.constructor.name, moduleName.organizationDetailsModule)
      .subscribe(res => {
        this.loading.stop();
        this.appId = res.response.app_id;
        this.initData = `({  <br />
          <span style="color: #8be9fd">AppID: </span> '${this.appId}',    <code style="color: red">// Your App ID </code><br />
             <span style="color: #8be9fd"> PropID: </span> '${this.currrentManagedPropID}', <code style="color: red"> // Your Current Property ID </code><br />
          <span style="color: #8be9fd">ShowLogs: </span>  true,   <code style="color: red">// Show Console Logs </code><br />
          })`;
      }, err => {
        this.loading.stop();
        this.alertMsg = err.message;
        this.isOpen = true;
        this.alertType = 'danger';
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


  copyToClipboard() {
    this.isCopied.one = true;
    const copyText: any =
      this.addScript + this.scriptUrl + this.closeScript;
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


  copyToClipboards() {
    this.isCopied.three = true;
    const copyText: any = `<script>
    // Replace Your AuthId '123123123'
    document.cookie = "authId=123123123";
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
