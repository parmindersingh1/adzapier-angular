import {Component, OnInit, ViewChild} from '@angular/core';
import {moduleName} from '../../_constant/module-name.constant';
import {BsModalRef, ModalDirective, BsModalService} from 'ngx-bootstrap/modal';
import {BillingService} from '../../_services/billing.service';
import {AuthenticationService} from '../../_services';
import {CCPAFormConfigurationService} from '../../_services/ccpaform-configuration.service';
import {DsarformService} from '../../_services/dsarform.service';
import {DataService} from '../../_services/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {mainPlans} from '../../_constant/main-plans.constant';
import { findPropertyIDFromUrl } from 'src/app/_helpers/common-utility';
import { Location } from '@angular/common';
class DefaultPlanData {
  plan_name: '';
  price: 0;
  product_name: '';
  stripe_plan_id: '';
}

@Component({
  selector: 'app-subscription-popup',
  templateUrl: './subscription-popup.component.html',
  styleUrls: ['./subscription-popup.component.scss']
})
export class SubscriptionPopupComponent implements OnInit {
  modalRef: BsModalRef;
  cookieConsentPlans = [];
  ConsentPrefPlans = [];
  @ViewChild('template', { static: true }) template: ModalDirective;
  allPlanData: any;
  billingCycle = 'monthly';
  currentPlanData: any = {
    cookieConsent: new DefaultPlanData(),
    consentPreference: new DefaultPlanData(),
    dsar: new DefaultPlanData()
  };
  type = 'cookieConsent';
  msg = '';
  mainFeatures = mainPlans;
  dsarPlans: any;
  existingOrgPlan = null;
  noPlanType = 'org';
  isUserSubscribe = false;
  isUserSubscribeDsar = false;
  showFeatureCount = 6;
  currentUser: any;
  skLoading = false;
  openModalStatus = false;
  queryOID;
  queryPID;
  isUserSubscribeConsent = false;
  constructor(
    private modalService: BsModalService,
    private billingService: BillingService,
    private authenticationService: AuthenticationService,
    private ccpaFormConfigurationService: CCPAFormConfigurationService,
    private dsarformService: DsarformService,
    private dataService: DataService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private location:Location
  ) {
    this.authService.currentUser.subscribe(x => {
      this.currentUser = x;
      if (this.currentUser) {
        this.onGetPlanDetails();
        this.onGetUserSubscriptions();
      }
    });
  }

  ngOnInit(): void {
    //this.router.routeReuseStrategy.shouldReuseRoute = () => false;
 this.activateRoute.queryParamMap
 .subscribe(params => {
   this.queryOID = params.get('oid');
   this.queryPID = params.get('pid');
});
    this.openModal();
  }

  onGetUserSubscriptions() {
    this.skLoading = true;
    this.billingService.getActivePlan(this.constructor.name, moduleName.manageSubscriptionsModule).subscribe((res: any) => {
      // this.isUserSubscribe = res.response.length;
      this.skLoading = false;
      if (res.status === 200) {
        const result = res.response;
        for (const obj of result) {
          if (obj.active && obj.planDetails.type === 0) {
            this.isUserSubscribe = true;
          }
          if (obj.active && obj.planDetails.type === 1) {
            this.isUserSubscribeDsar = true;
          }
          if (obj.active && obj.planDetails.type === 2) {
            this.isUserSubscribeConsent = true;
          }
        }
      }
    }, error => {
      this.skLoading = false;
    });
  }
  


  openModal() {
    this.dataService.openModalWithData.subscribe(res => {
      this.openModalStatus = res.openModal;
      if (res.openModal) {
        if (!res.data) {
          this.currentPlanData = new DefaultPlanData();
        }
        if (res.type) {
          this.noPlanType = res.type;
        }
        if (res.data) {
          if (Object.keys(res.data).length !== 0) {
            this.type = res.type;
            this.currentPlanData = res.data;
            // if (res.data !== undefined) {
            //   this.existingOrgPlan = res.data;
            // }
          } else if (!res.data && res.type == 'org') {
            this.type = 'org';
            this.currentPlanData = new DefaultPlanData();
          }  else if (!res.data && res.type == 'consentPreference') {
            this.type = 'consentPreference';
            this.currentPlanData = new DefaultPlanData();
          }else {
            this.type = 'noPlan';
            this.currentPlanData = new DefaultPlanData();
          }
        } else {
          this.type = 'noPlan';
        }
        this.template.config = {
        backdrop: true,
        ignoreBackdropClick: true
        }; // to avoid browser scrollbar issue appears due to modal does not get hide properly.
        this.template.show();
      }
    });
  }

  onGetPlanDetails() {
    this.billingService.getCurrentPlanInfo(this.constructor.name, moduleName.pricingModule).subscribe((res: any) => {
      this.allPlanData = res.response;
      this.onSetEnterPrice();
      this.cookieConsentPlans = this.allPlanData.cookieConsent[`${this.billingCycle}`];
      this.dsarPlans = this.allPlanData.dsar[`${this.billingCycle}`];
      this.ConsentPrefPlans = this.allPlanData.consentPreference[`${this.billingCycle}`]
      // this.subscriptionList = res.response.monthly;
    }, error => {
    });
  }

  onSetEnterPrice() {
    this.allPlanData.cookieConsent['monthly'].push({
      cycle: 'Enterprise',
      description: '',
      id: '',
      name: 'Enterprise',
      price: -1,
      product_name: 'Advanced enterprise features and global coverage.',
      type: 0
    });
    this.allPlanData.cookieConsent['yearly'].push({
      cycle: 'Enterprise',
      description: '',
      id: '',
      name: 'Enterprise',
      price: -1,
      product_name: 'Advanced enterprise features and global coverage.',
      type: 0
    });

    this.allPlanData.dsar['monthly'].push({
      cycle: 'Enterprise',
      description: '',
      id: '',
      name: 'Enterprise',
      price: -1,
      product_name: 'Advanced enterprise features and global coverage.',
      type: 0
    });
    this.allPlanData.dsar['yearly'].push({
      cycle: 'Enterprise',
      description: '',
      id: '',
      name: 'Enterprise',
      price: -1,
      product_name: 'Advanced enterprise features and global coverage.',
      type: 0
    });
    this.allPlanData.consentPreference['monthly'].push({
      cycle: 'Enterprise',
      description: '',
      id: '',
      name: 'Enterprise',
      price: -1,
      product_name: 'Advanced enterprise features and global coverage. Volume discount available.',
      type: 0
    });
    this.allPlanData.consentPreference['yearly'].push({
      cycle: 'Enterprise',
      description: '',
      id: '',
      name: 'Enterprise',
      price: -1,
      product_name: 'Advanced enterprise features and global coverage. Volume discount available.',
      type: 0
    });
  }

  onSelectBillingCycle(e) {
    if (e.checked) {
      this.billingCycle = 'yearly';
      this.cookieConsentPlans = this.allPlanData.cookieConsent[`${this.billingCycle}`]
      this.dsarPlans = this.allPlanData.dsar[`${this.billingCycle}`]
      this.ConsentPrefPlans = this.allPlanData.consentPreference[`${this.billingCycle}`]


    } else {
      this.billingCycle = 'monthly';
      this.cookieConsentPlans = this.allPlanData.cookieConsent[`${this.billingCycle}`]
      this.dsarPlans = this.allPlanData.dsar[`${this.billingCycle}`]
      this.ConsentPrefPlans = this.allPlanData.consentPreference[`${this.billingCycle}`]

    }
  }

  onNavigate() {
    this.template.hide();
    this.router.navigateByUrl('/settings/billing/pricing')
  }

  onTemplateHide() {
    document.body.classList.remove('modal-open');
    this.template.hide();
    let oIDPIDFromURL = findPropertyIDFromUrl(this.location.path());
    if (this.location.path().indexOf('/settings') !== -1 && this.queryOID !== null && this.queryOID !== undefined) {
      this.router.navigate(['/home/dashboard/analytics'], { queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling: 'merge', skipLocationChange: false });
    } else {
      this.router.navigate(['/home/dashboard/analytics'], { queryParams: { oid: oIDPIDFromURL[0], pid: oIDPIDFromURL[1] }, queryParamsHandling: 'merge', skipLocationChange: false });
    }
  }

  redirectToManageLicense() {
    document.body.classList.remove('modal-open');
    this.template.hide();
    let oIDPIDFromURL = findPropertyIDFromUrl(this.location.path())
    if (this.queryOID !== null && this.queryOID !== undefined) {
      this.router.navigate(['/settings/billing/manage'], { queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling: 'merge', skipLocationChange: false });
    } else {
      this.router.navigate(['/settings/billing/manage'], { queryParams: { oid: oIDPIDFromURL[0], pid: oIDPIDFromURL[1] }, queryParamsHandling: 'merge', skipLocationChange: false });
    }
  }
}
