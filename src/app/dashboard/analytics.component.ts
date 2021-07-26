import { Component, AfterViewChecked, OnInit, ChangeDetectorRef } from '@angular/core';
import { faChrome, faEdge, faFirefox, faSafari, faOpera } from '@fortawesome/free-brands-svg-icons';
import { AuthenticationService } from 'src/app/_services';

import { DataService } from '../_services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements AfterViewChecked, OnInit {
  faChrome = faChrome;
  faEdge = faEdge;
  faFirefox = faFirefox;
  faSafari = faSafari;
  faOpera = faOpera;
  loginToken;
  currentUser: any;
  isCollapsed: any;
  isLicenseAssignedtoProperty = false;
  isLicenseAssignedtoOrganization = false;
  isConsentPreferenceLicenseAssignedToProperty = false;
  dsarTooltiptext:string;
  consentTooltipText:string;
  cookieTooltiptext:string;
  arryt:any = [];
  appsContent:any = [];
  purchsedApps:any = [];
  appsPositionRowOne:any = [];
  appsPositionRowTwo:any = [];
  appsPositionRowThree:any = [];
  noOfLicensePurchased:number;
  constructor(
    private authService: AuthenticationService,
    private dataService: DataService,
    private cdRef: ChangeDetectorRef
  ) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
    this.isCollapsed = false;
    this.loadAppContent();
   }
  // redirect to home if already logged in


  ngOnInit(){
   this.isPropertyLicenseAssigned();
   this.isOrganizationLicenseAssigned();
   this.isConsentPreferenceLicenseAssigned();
   this.checkDivLength();
   this.loadAppContent();
   this.allocateElementToRows();
  }

  isPropertyLicenseAssigned():boolean {
    this.dataService.isLicenseAppliedForProperty.subscribe((status) =>  {
    this.isLicenseAssignedtoProperty = status.hasaccess;
    });
    this.cookieTooltiptext = this.isLicenseAssignedtoProperty ? '' : 'You have not assigned Cookie consent license to selected property';
    return this.isLicenseAssignedtoProperty;
  }

  isConsentPreferenceLicenseAssigned():boolean {
    this.dataService.isConsentPreferenceAppliedForProperty.subscribe((status) =>  {
    this.isConsentPreferenceLicenseAssignedToProperty = status.hasaccess;
    });
    this.consentTooltipText = this.isConsentPreferenceLicenseAssignedToProperty ? '' : 'You have not assigned Consent Preference to selected property';
    return this.isConsentPreferenceLicenseAssignedToProperty;
  }

  isOrganizationLicenseAssigned():boolean {
    let licenseStatus;
    this.dataService.isLicenseApplied.subscribe((status) =>  {
     licenseStatus = status.hasaccess;
     this.isLicenseAssignedtoOrganization = licenseStatus;
     this.dsarTooltiptext = this.isLicenseAssignedtoOrganization ? '' : 'You have not assigned DSAR license to selected organization';
    });
    return this.isLicenseAssignedtoOrganization = licenseStatus;
  }

   checkDivLength(){
    return this.appsContent.filter((t)=>t.isLicensepurchased == true).length;
  }

  ngAfterViewChecked(){
    this.isPropertyLicenseAssigned();
   this.isOrganizationLicenseAssigned();
   this.isConsentPreferenceLicenseAssigned();
    let checknoofDivs = this.checkDivLength();
    if(checknoofDivs !== this.noOfLicensePurchased){
      this.noOfLicensePurchased = checknoofDivs;
      this.cdRef.detectChanges();
    }
  }

  loadAppContent(){
    this.appsContent = [{
      id:1,
      isLicensepurchased:this.isLicenseAssignedtoProperty,
      title:"Cookie Consent Dashboard",
      iconcss:"fas fa-chart-line tx-primary temp-blue center tx-64 margin-15",
      content:"Real-time dashboard and analytics to improve your opt-in rates with in-depth reporting.",
      tooltipcontent: this.cookieTooltiptext,
      routerlinktext:this.isLicenseAssignedtoProperty ? '/home/dashboard/cookie-consent' : '/settings/billing/manage',
      buttonText:this.isLicenseAssignedtoProperty ? 'Go Now' : 'Try Now'
    },
    {
     id:2,
     isLicensepurchased:this.isLicenseAssignedtoProperty,
     title:"Banner Configuration",
     iconcss:"fas fa-layer-group tx-primary temp-blue center tx-64 margin-15",
     content:"Configure geo specific cookie banner, language and preference center.",
     tooltipcontent: this.cookieTooltiptext,
     routerlinktext:this.isLicenseAssignedtoProperty ? '/cookie-consent/cookie-banner' : '/settings/billing/manage',
     buttonText: this.isLicenseAssignedtoProperty ? 'Go Now' : 'Try Now'
   }, {
     id:3,
     isLicensepurchased:this.isLicenseAssignedtoProperty,
     title:"Setup",
     iconcss:"fas fa-wrench tx-primary temp-blue fa-3x center tx-64 margin-15",
     content:"Setup consent banner Javascript CDN into your application",
     tooltipcontent: this.cookieTooltiptext,
     routerlinktext:this.isLicenseAssignedtoProperty ? '/cookie-consent/cookie-banner/setup' : '/settings/billing/manage',
     buttonText:this.isLicenseAssignedtoProperty ? 'Go Now' : 'Try Now'
   }, {
     id:4,
     isLicensepurchased:this.isLicenseAssignedtoOrganization,
     title:"Data Subject Request",
     iconcss:"fas fa-balance-scale tx-primary temp-blue center tx-64 margin-15",
     content:"Create dynamic forms and respond to privacy rights requests to meet regulatory deadlines.",
     tooltipcontent: this.dsarTooltiptext,
     routerlinktext:this.isLicenseAssignedtoOrganization ? ['/privacy/dsar/requests'] : ['/settings/billing/manage'],
     buttonText:this.isLicenseAssignedtoOrganization ? 'Go Now' : 'Try Now'
   }, {
     id:5,
     isLicensepurchased:this.isConsentPreferenceLicenseAssignedToProperty,
     title:"Consent preference",
     iconcss:"fas fa-file-signature tx-primary temp-blue center tx-64 margin-15",
     content:"Collect user preference consent, document opt-ins/out via your web forms and systems.",
     tooltipcontent: this.consentTooltipText,
     routerlinktext:this.isConsentPreferenceLicenseAssignedToProperty ? ['/home/dashboard/consent-preference'] : ['/settings/billing/manage'],
     buttonText:this.isConsentPreferenceLicenseAssignedToProperty ? 'Go Now' : 'Try Now'
   }];
  }

  allocateElementToRows(){
    let checknoofDivs = this.checkDivLength();
    if(checknoofDivs !== this.noOfLicensePurchased){
      this.noOfLicensePurchased = checknoofDivs;
      this.cdRef.detectChanges();
    }
    if(this.noOfLicensePurchased !== undefined){
      if(this.noOfLicensePurchased == 5){
        this.appsPositionRowOne.length = 0;
        this.appsPositionRowTwo.length = 0;
        this.appsPositionRowOne = this.appsContent.filter((item)=>item.isLicensepurchased == true).slice(0,3);
        this.appsPositionRowTwo = this.appsContent.filter((item)=>item.isLicensepurchased == true).slice(3,5);
      } else if(this.noOfLicensePurchased == 4){
        this.appsPositionRowOne.length = 0;
        this.appsPositionRowTwo.length = 0;
        this.appsPositionRowThree.length = 0;
        this.appsPositionRowOne = this.appsContent.filter((item)=>item.isLicensepurchased == true).slice(0,3);
        this.appsPositionRowTwo = this.appsContent.filter((item)=>item.isLicensepurchased == true).slice(3,4);
        this.appsPositionRowThree = this.appsContent.filter((item)=>item.isLicensepurchased == false);
      } else if(this.noOfLicensePurchased == 3){
        this.appsPositionRowOne.length = 0;
        this.appsPositionRowThree.length = 0;
        this.appsPositionRowOne = this.appsContent.filter((item)=>item.isLicensepurchased == true);
        this.appsPositionRowThree = this.appsContent.filter((item)=>item.isLicensepurchased == false);
      } else if(this.noOfLicensePurchased == 2){
        this.appsPositionRowOne.length = 0;
        this.appsPositionRowThree.length = 0;
        this.appsPositionRowOne = this.appsContent.filter((item)=>item.isLicensepurchased == true);
        this.appsPositionRowThree = this.appsContent.filter((item)=>item.isLicensepurchased == false).slice(0,3);
      } else if(this.noOfLicensePurchased == 1){
        this.appsPositionRowOne.length = 0;
        this.appsPositionRowTwo.length = 0;
        this.appsPositionRowThree.length = 0;
        this.appsPositionRowOne = this.appsContent.filter((item)=>item.isLicensepurchased == true);
        this.appsPositionRowTwo = this.appsContent.filter((item)=>item.isLicensepurchased == false).slice(0,3);
        this.appsPositionRowThree = this.appsContent.filter((item)=>item.isLicensepurchased == false).slice(3,4);
      } else if(this.noOfLicensePurchased == 0){
        this.appsPositionRowOne.length = 0;
        this.appsPositionRowTwo.length = 0;
        this.appsPositionRowOne = this.appsContent.filter((item)=>item.isLicensepurchased == false).slice(0,3);
        this.appsPositionRowTwo = this.appsContent.filter((item)=>item.isLicensepurchased == false).slice(3,5);
      }
  }
  }

   
}
