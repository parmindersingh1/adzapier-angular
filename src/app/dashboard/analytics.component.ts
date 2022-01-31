import { Component, AfterViewChecked, OnInit, ChangeDetectorRef, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faChrome, faEdge, faFirefox, faSafari, faOpera } from '@fortawesome/free-brands-svg-icons';
import { Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthenticationService, OrganizationService, UserService } from 'src/app/_services';
import { featuresName } from '../_constant/features-name.constant';
import { moduleName } from '../_constant/module-name.constant';
import { DataService } from '../_services/data.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  faChrome = faChrome;
  faEdge = faEdge;
  faFirefox = faFirefox;
  faSafari = faSafari;
  faOpera = faOpera;
  loginToken;
  currentUser: any;
  isLicenseAssignedtoProperty = false;
  isLicenseAssignedtoOrganization = false;
  isConsentPreferenceLicenseAssignedToProperty = false;
  dsarTooltiptext: string;
  consentTooltipText: string;
  cookieTooltiptext: string;
  arryt: any = [];
  appsContent: any = [];
  purchsedApps: any = [];
  appsPositionRowOne: any = [];
  appsPositionRowTwo: any = [];
  appsPositionRowThree: any = [];
  noOfLicensePurchased: number = 0;
  skeletonLoading = true;
  queryOID;
  queryPID;
  sub: Subscription;
  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private orgService: OrganizationService,
    private dataService: DataService,
    private loading: NgxUiLoaderService,
    private userService:UserService,
    private cdRef: ChangeDetectorRef,
    private titleService: Title 

  ) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
    this.activateRoute.queryParamMap
      .subscribe(params => {
        this.queryOID = params.get('oid');
        this.queryPID = params.get('pid');
      });
      this.titleService.setTitle("Home - Adzapier Portal");

   }
  // redirect to home if already logged in


  ngOnInit() {
    this.userService.addUserActionOnActualButton.next({quickstartid:8,isclicked:null,isactualbtnclicked:false});
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    if(this.queryOID !== null && this.queryOID !== undefined){
    const obj = {
      organization_id: this.queryOID,
      property_id: this.queryPID
    };
    this.loadOrganizationPlanDetails(obj);
    this.loadPropertyPlanDetails(obj);
  }
    this.isConsentPreferenceLicenseAssigned();
    this.checkDivLength();
    this.loadAppContent();
  



  }

  isPropertyLicenseAssigned(status): boolean {
    this.isLicenseAssignedtoProperty = status;
    this.cookieTooltiptext = this.isLicenseAssignedtoProperty ? '' : 'The selected property has not been assigned to Cookie Consent subscription';
    return this.isLicenseAssignedtoProperty; //|| ispropplanExist !== undefined ? true : false;
  }

  isConsentPreferenceLicenseAssigned(): boolean {
    this.dataService.isConsentPreferenceAppliedForProperty.subscribe((status) => {
    this.isConsentPreferenceLicenseAssignedToProperty = status.hasaccess;
    });
    this.consentTooltipText = this.isConsentPreferenceLicenseAssignedToProperty ? '' : 'The selected property has not been assigned to Consent Preference subscription';
    return this.isConsentPreferenceLicenseAssignedToProperty;
  }

  isOrganizationLicenseAssigned(status): boolean {
    this.isLicenseAssignedtoOrganization = status;
    this.dsarTooltiptext = this.isLicenseAssignedtoOrganization ? '' : 'The selected organization has not been assigned to DSAR subscription';

    return this.isLicenseAssignedtoOrganization;
  }

  checkDivLength() {
    return this.appsContent.filter((t) => t.isLicensepurchased == true).length;
  }

  ngAfterViewChecked() {
    this.getSelectedOrgIDPropertyID();
  }

  loadAppContent() {
    this.appsContent = [{
      id: 1,
      isLicensepurchased: this.isLicenseAssignedtoProperty,
      title: "Cookie Consent Dashboard",
      iconcss: "fas fa-chart-line tx-primary temp-blue center tx-64 margin-15",
      content: "Real-time dashboard and analytics to improve your opt-in rates with in-depth reporting.",
      tooltipcontent: this.isLicenseAssignedtoProperty ? '' : this.cookieTooltiptext,
      routerlinktext: this.isLicenseAssignedtoProperty ? '/home/dashboard/cookie-consent' : '/settings/billing/manage',
      buttonText: this.isLicenseAssignedtoProperty ? 'Go Now' : 'Try Now'
    },
    {
      id: 2,
      isLicensepurchased: this.isLicenseAssignedtoProperty,
      title: "Banner Configuration",
      iconcss: "fas fa-layer-group tx-primary temp-blue center tx-64 margin-15",
      content: "Configure geo-specific cookie banner, language and preference center.",
      tooltipcontent: this.isLicenseAssignedtoProperty ? '' : this.cookieTooltiptext,
      routerlinktext: this.isLicenseAssignedtoProperty ? '/cookie-consent/banner-configuration' : '/settings/billing/manage',
      buttonText: this.isLicenseAssignedtoProperty ? 'Go Now' : 'Try Now'
    }, {
      id: 3,
      isLicensepurchased: this.isLicenseAssignedtoProperty,
      title: "Setup",
      iconcss: "fas fa-wrench tx-primary temp-blue fa-3x center tx-64 margin-15",
      content: "Setup consent banner JavaScript CDN into your application",
      tooltipcontent: this.isLicenseAssignedtoProperty ? '' : this.cookieTooltiptext,
      routerlinktext: this.isLicenseAssignedtoProperty ? '/cookie-consent/cookie-banner/setup' : '/settings/billing/manage',
      buttonText: this.isLicenseAssignedtoProperty ? 'Go Now' : 'Try Now'
    }, {
      id: 4,
      isLicensepurchased: this.isLicenseAssignedtoOrganization,
      title: "Data Subject Request",
      iconcss: "fas fa-balance-scale tx-primary temp-blue center tx-64 margin-15",
      content: "Create dynamic forms and respond to privacy rights requests to meet regulatory deadlines.",
      tooltipcontent: this.isLicenseAssignedtoOrganization ? '' : this.dsarTooltiptext,
      routerlinktext: this.isLicenseAssignedtoOrganization ? ['/privacy/dsar/requests'] : ['/settings/billing/manage'],
      buttonText: this.isLicenseAssignedtoOrganization ? 'Go Now' : 'Try Now'
    }, {
      id: 5,
      isLicensepurchased: this.isConsentPreferenceLicenseAssignedToProperty,
      title: "Consent Preference",
      iconcss: "fas fa-file-signature tx-primary temp-blue center tx-64 margin-15",
      content: "Collect user preference consent, document opt-ins/opt-outs via your web forms and systems.",
      tooltipcontent: this.isConsentPreferenceLicenseAssignedToProperty ? '' : this.consentTooltipText,
      routerlinktext: this.isConsentPreferenceLicenseAssignedToProperty ? ['/home/dashboard/consent-preference'] : ['/settings/billing/manage'],
      buttonText: this.isConsentPreferenceLicenseAssignedToProperty ? 'Go Now' : 'Try Now'
    }];
    return this.appsContent;
  }

  allocateElementToRows() {
   // this.skeletonLoading = true;
    let checknoofDivs = this.checkDivLength();
    if (checknoofDivs !== this.noOfLicensePurchased) {
      this.noOfLicensePurchased = checknoofDivs;
      this.cdRef.detectChanges();
    }
    if (this.noOfLicensePurchased !== undefined) {
      if (this.noOfLicensePurchased == 5) {
        this.appsPositionRowOne.length = 0;
        this.appsPositionRowTwo.length = 0;
        this.appsPositionRowThree.length = 0;
        this.appsPositionRowOne = this.appsContent.filter((item) => item.isLicensepurchased == true).slice(0, 3);
        this.appsPositionRowTwo = this.appsContent.filter((item) => item.isLicensepurchased == true).slice(3, 5);
        this.skeletonLoading = false;
      } else if (this.noOfLicensePurchased == 4) {
        this.appsPositionRowOne.length = 0;
        this.appsPositionRowTwo.length = 0;
        this.appsPositionRowThree.length = 0;
        this.appsPositionRowOne = this.appsContent.filter((item) => item.isLicensepurchased == true).slice(0, 3);
        this.appsPositionRowTwo = this.appsContent.filter((item) => item.isLicensepurchased == true).slice(3, 4);
        this.appsPositionRowThree = this.appsContent.filter((item) => item.isLicensepurchased == false);
        this.skeletonLoading = false;
      } else if (this.noOfLicensePurchased == 3) {
        this.appsPositionRowOne.length = 0;
        this.appsPositionRowThree.length = 0;
        this.appsPositionRowTwo.length = 0;
        this.appsPositionRowOne = this.appsContent.filter((item) => item.isLicensepurchased == true);
        this.appsPositionRowThree = this.appsContent.filter((item) => item.isLicensepurchased == false);
        this.skeletonLoading = false;
      } else if (this.noOfLicensePurchased == 2) {
        this.appsPositionRowOne.length = 0;
        this.appsPositionRowThree.length = 0;
        this.appsPositionRowOne = this.appsContent.filter((item) => item.isLicensepurchased == true);
        this.appsPositionRowThree = this.appsContent.filter((item) => item.isLicensepurchased == false).slice(0, 3);
        this.skeletonLoading = false;
      } else if (this.noOfLicensePurchased == 1) {
        this.appsPositionRowOne.length = 0;
        this.appsPositionRowTwo.length = 0;
        this.appsPositionRowThree.length = 0;
        this.appsPositionRowOne = this.appsContent.filter((item) => item.isLicensepurchased == true);
        this.appsPositionRowTwo = this.appsContent.filter((item) => item.isLicensepurchased == false).slice(0, 3);
        this.appsPositionRowThree = this.appsContent.filter((item) => item.isLicensepurchased == false).slice(3, 4);
        this.skeletonLoading = false;
      } else if (this.noOfLicensePurchased == 0) {
        this.appsPositionRowOne.length = 0;
        this.appsPositionRowTwo.length = 0;
        this.appsPositionRowOne = this.appsContent.filter((item) => item.isLicensepurchased == false).slice(0, 3);
        this.appsPositionRowTwo = this.appsContent.filter((item) => item.isLicensepurchased == false).slice(3, 5);
        this.skeletonLoading = false;
      }
    }
  }

  getSelectedOrgIDPropertyID() {
    this.orgService.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.isConsentPreferenceLicenseAssigned();
        let checknoofDivs = this.checkDivLength();
        if (checknoofDivs !== this.noOfLicensePurchased) {
          this.noOfLicensePurchased = checknoofDivs;
          this.cdRef.detectChanges();
        }
      }
    }, (error) => {
      console.log(error, 'error.');
    });
  }
   
  loadOrganizationPlanDetails(org) {
    this.skeletonLoading = true;
    this.dataService.removeOrgPlanFromLocalStorage();
    this.dataService.getOrgPlanInfo(this.constructor.name, moduleName.cookieConsentModule, org.organization_id || org.id)
      .subscribe((res: any) => {
        this.dataService.setOrgPlanToLocalStorage(res);
        if (res.response && res.response.plan_details && res.response.plan_details.dsar) {
          if (Object.values(res.response.plan_details.dsar).length > 0) {
            let status = true;
            this.isOrganizationLicenseAssigned(status);
            if (status) {
              this.loadAppContent();
              this.allocateElementToRows();
            }
          } else {
            let status = false;
            this.isOrganizationLicenseAssigned(status);
            if (!status) {
              this.loadAppContent();
              this.allocateElementToRows();
            }
          }
        }
      }, error => {
        console.log(error,'error');
      });
  }

  

  loadPropertyPlanDetails(prop) {
    this.skeletonLoading = true;
    this.dataService.removePropertyPlanFromLocalStorage();
    this.dataService.getPropertyPlanDetails(this.constructor.name, moduleName.cookieConsentModule, prop.property_id).subscribe((res: any) => {
        if (res.response && res.response.plan_details && res.response.plan_details.cookieConsent) {
          if (Object.values(res.response.plan_details.cookieConsent).length > 0) {
            let status = true;
            this.isPropertyLicenseAssigned(status);
            this.loadAppContent();
            this.allocateElementToRows();
          } else {
            const isAllowConsentPreference = this.dataService.isAllowFeatureByYes(res.response, featuresName.CONSENT_PREFERENCE);
            this.isConsentPreferenceLicenseAssignedToProperty = isAllowConsentPreference;
            let status = false;
            this.isPropertyLicenseAssigned(status);
            if (!status) {
              this.loadAppContent();
              this.allocateElementToRows();
            }
          }
        }
        this.dataService.setPropertyPlanToLocalStorage(res);
      }, err => {
        console.log(err);
      });
  }

  ngOnDestroy() {
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }
}
