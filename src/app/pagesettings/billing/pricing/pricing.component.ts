import {Component, OnInit, AfterViewInit, TemplateRef, ChangeDetectorRef} from '@angular/core';
import {Router} from '@angular/router';
import {BillingService} from '../../../_services/billing.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {DataService} from '../../../_services/data.service';
import {UserService} from '../../../_services';
import {moduleName} from '../../../_constant/module-name.constant';
import {environment} from '../../../../environments/environment';
import {featuresComparison, highLightFeatures} from '../../../_constant/main-plans.constant';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { QuickmenuService } from 'src/app/_services/quickmenu.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit, AfterViewInit {
  private unsubscribeAfterUserAction$: Subject<any> = new Subject<any>();
  subscriptionPlan;
  planDetails: any;
  dsarPlanList: any;
  consentPreferenceList: any;
  skeletonLoader = false;
  highLightFeatures = highLightFeatures;
  featuresComparison = featuresComparison;
  subscriptionList = [];
  cookieConsentBillingCycle = 'monthly';
  addonsBillingCycle = 'monthly';
  stripe = (window as any).Stripe(environment.stripePublishablekey);
  cartItem = [];
  currentFeature = 'cookieConsent';
  // subscriptionPlanType = 'CCPA';
  maxCookiePreferenceList = 4;
  subTotal = 0;
  userEmail: any;
  skeletonLoaderFeature = true;
  currentPlan = {
    amount: null,
    duration: null,
    services: null
  };
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  percentOff = 0;
  promoCode: any;
  activeData = {
    cookieConsent: {maxPrice: -1, maxPlanID: '', cycle: 'monthly'},
    dsar: {maxPrice: -1, maxPlanID: '', cycle: 'monthly'},
    consentPreference: {maxPrice: -1, maxPlanID: '', cycle: 'monthly'}
  };
  featuresList = [];
  isPromoCodeActive = false;
  isPromoCodeError = false;
  currentStep = 1;
  modalRef: BsModalRef;
  initialPropertyID;
  initialOrgID;
  isquickstartmenu:any;
  isbtnClickedbyUser;
  quickDivID;
  isRevistedLink:boolean;
  currentLinkID:any;
  actuallinkstatus:boolean = false;
  
  constructor(private router: Router,
              private loading: NgxUiLoaderService,
              private dataService: DataService,
              private userService: UserService,
              private modalService: BsModalService,
              private quickmenuService: QuickmenuService,
              private billingService: BillingService,
              private cdRef: ChangeDetectorRef) {
              this.onGetActivePlan();
  }

  ngOnInit() {
    this.quickmenuService.onClickEmitQSLinkobj.subscribe((res) => { 
      this.quickDivID = res.linkid;
      this.callForQuickStart();
    });
    //this.userService.isRevisitedQSMenuLink.subscribe((status) => { this.isRevistedLink = status.reclickqslink; this.currentLinkID = status.quickstartid; });
    // this.onGetPlanCompareData()
    this.onGetActivePlan();
    this.onGetPlanDetails();
    this.onGetUserEmail();
    // this.onSetValue();
    // this.onGetCurrentPlan();
    // const div = document.querySelector('#main');
    // div.classList.remove('container');
    const element = document.getElementById('main');
    element.classList.remove('container');
    element.classList.remove('site-content');
    element.classList.add('container-fluid');
    element.style.padding = '0px';
    element.style.margin = '0px';
  }


  onGetPlanCompareData() {
    this.loading.start('f1');
    this.skeletonLoaderFeature = true;
    this.billingService.getFeaureData(this.constructor.name, moduleName.manageSubscriptionsModule).subscribe((res: any) => {
      this.skeletonLoaderFeature = false;
      this.loading.stop('f1');
      this.featuresList = res.response;
    }, error => {
      this.skeletonLoaderFeature = false;
      this.loading.stop('f1');
    })
  }

  onGetActivePlan() {
    this.loading.start('2')
    this.skeletonLoader = true;
    this.billingService.getActivePlan(this.constructor.name, moduleName.manageSubscriptionsModule).subscribe((res: any) => {
      this.loading.stop('2');
      this.skeletonLoader = false;
      this.onSelectActivePlan(res.response)
    }, err => {
      this.loading.stop('2');
      this.skeletonLoader = false;
      this.isOpen = true;
      this.alertMsg = err;
      this.alertType = 'danger';
    })
  }

  onSelectActivePlan(record) {
    try {
      const activeData = this.activeData;
      for (const data of record) {
        if (data.active && data.planDetails.type === 0) {
          if (data.planDetails.price > activeData.cookieConsent.maxPrice) {
            activeData.cookieConsent.maxPrice = data.planDetails.price;
            activeData.cookieConsent.maxPlanID = data.planDetails.stripe_plan_id;
            activeData.cookieConsent.cycle = data.planDetails.cycle;
            this.cookieConsentBillingCycle = data.planDetails.cycle;
          }
        } else if (data.planDetails.price > activeData.dsar.maxPrice && data.active && data.planDetails.type === 1) {
          activeData.dsar.maxPrice = data.planDetails.price;
          activeData.dsar.maxPlanID = data.planDetails.stripe_plan_id;
          activeData.dsar.cycle = data.planDetails.cycle;
          this.addonsBillingCycle = data.planDetails.cycle;
        } else if (data.planDetails.price > activeData.consentPreference.maxPrice && data.active && data.planDetails.type === 2) {
          activeData.consentPreference.maxPrice = data.planDetails.price;
          activeData.consentPreference.maxPlanID = data.planDetails.stripe_plan_id;
          activeData.consentPreference.cycle = data.planDetails.cycle;

        }
      }
      this.activeData = activeData;
      this.subscriptionList = this.planDetails.cookieConsent[`${this.cookieConsentBillingCycle}`];
      this.dsarPlanList = this.planDetails.dsar[`${this.addonsBillingCycle}`];
      this.consentPreferenceList = this.planDetails.consentPreference[`${this.addonsBillingCycle}`];
    } catch (e) {
    }
  }

  onGetPlanDetails() {
    this.loading.start();
    this.skeletonLoader = true;
    this.billingService.getCurrentPlanInfo(this.constructor.name, moduleName.pricingModule).subscribe((res: any) => {
      this.loading.stop();
      this.skeletonLoader = false;
      this.planDetails = res.response;
      this.onSetPlans(res.response);
      this.callForQuickStart();
      // this.subscriptionList = res.response.monthly;
    }, error => {
      this.loading.stop();
      this.skeletonLoader = false;
      this.isOpen = true;
      this.alertMsg = error;
      this.alertType = 'danger';
    });
  }

  onSetPlans(plansData) {
    this.subscriptionList = plansData.cookieConsent[`${this.cookieConsentBillingCycle}`];
    this.dsarPlanList = plansData.dsar[`${this.cookieConsentBillingCycle}`];
    this.consentPreferenceList = plansData.consentPreference[`${this.cookieConsentBillingCycle}`];
  }

  ngOnDestroy() {
    const element = document.getElementById('main');
    element.classList.remove('container-fluid');
    element.style.padding = null;
    element.style.margin = null;
    element.classList.add('container');
    element.classList.add('site-content');
    this.quickDivID = "";
    this.unsubscribeAfterUserAction$.unsubscribe();
  }

  onGetUserEmail() {
    this.loading.start();
    this.userService.getLoggedInUserDetails(this.constructor.name, moduleName.pricingModule).subscribe(res => {
      this.loading.stop();
      const result: any = res;
      if (result.status === 200) {
        this.userEmail = result.response.email;
      }
    }, error => {
      this.loading.stop();
      console.log(error);
    });
  }

  onSelectPlan() {
    const plans = [];
    for (const pricing of this.cartItem) {
      plans.push({plan_id: pricing.id, units: pricing.unit});
    }
    if (this.userEmail) {
      let payloads = {};
      payloads = {
        coupon_code: this.isPromoCodeActive ? this.promoCode : '',
        plan_details: plans,
        email: this.userEmail
      };
      this.loading.start();
      this.billingService.getSessionId(payloads, this.constructor.name, moduleName.pricingModule).subscribe(res => {
        this.loading.stop();
        const result: any = res;
        if (result.status === 200) {
          this.onCheckOut(result.response);
        }
      }, error => {
        this.loading.stop();
        const err: any = JSON.parse(error);
        this.isOpen = true;
        this.alertMsg = err.message;
        this.alertType = 'danger';
      });
    } else {
      location.reload();
    }
  }

  onSelectPlanType(event) {
    if (event.target.checked) {
      this.subscriptionList = this.planDetails[`${this.cookieConsentBillingCycle}`];
    } else {
      // this.subscriptionPlanType = 'CCPA';
    }
  }

  onSelectCookieConsentBillingCycle(e) {
    try {
      if (e.checked) {
        this.cookieConsentBillingCycle = 'yearly';
        this.subscriptionList = this.planDetails.cookieConsent[`${this.cookieConsentBillingCycle}`];
        this.dsarPlanList = this.planDetails.dsar[`${this.cookieConsentBillingCycle}`];
        this.consentPreferenceList = this.planDetails.consentPreference[`${this.cookieConsentBillingCycle}`];
      } else {
        this.cookieConsentBillingCycle = 'monthly';
        this.subscriptionList = this.planDetails.cookieConsent[`${this.cookieConsentBillingCycle}`];
        this.dsarPlanList = this.planDetails.dsar[`${this.cookieConsentBillingCycle}`];
        this.consentPreferenceList = this.planDetails.consentPreference[`${this.cookieConsentBillingCycle}`];
      }
    } catch (e) {
    }
  }


  onSelectAddoncookieConsentBillingCycle(e) {
    if (e.checked) {
      this.addonsBillingCycle = 'yearly';
      this.dsarPlanList = this.planDetails.dsar[`${this.addonsBillingCycle}`];
      this.consentPreferenceList = this.planDetails.consentPreference[`${this.addonsBillingCycle}`];
    } else {
      this.addonsBillingCycle = 'monthly';
      this.dsarPlanList = this.planDetails.dsar[`${this.addonsBillingCycle}`];
      this.consentPreferenceList = this.planDetails.consentPreference[`${this.addonsBillingCycle}`];
    }
  }


  onGetCurrentPlan() {
    this.loading.start();
    this.billingService.getCurrentPlanInfo(this.constructor.name, moduleName.pricingModule).subscribe((res: any) => {
      this.loading.stop();
      if (!res.error) {
        this.currentPlan = res.response;
        this.cookieConsentBillingCycle = res.response.duration === 'month' ? 'MONTHLY' : 'YEARLY';
        // this.onSetValue();
      } else {
        this.currentPlan.services = res.error.services;
      }
    }, error => {
      this.loading.stop();
      this.isOpen = true;
      this.alertMsg = error;
      this.alertType = 'danger';
    });
  }

  onUpgradePlan(plan) {
    this.loading.start();
    const payloads = {};
    this.billingService.upGradePlan(payloads, this.constructor.name, moduleName.pricingModule).subscribe((res: any) => {
      this.loading.stop();
      if (res.status === 200) {
        this.isOpen = true;
        this.alertMsg = 'Your Plan has been Upgraded';
        this.alertType = 'info';
        this.onGetCurrentPlan();
      }
    }, error => {
      this.loading.stop();
      this.isOpen = true;
      this.alertMsg = error;
      this.alertType = 'danger';
    });
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  onAddToCart(planDetails: any, planUnit: any) {
    // const isItem = this.cartItem.includes((plan));
    // if (isItem) {
    //   this.cartItem = this.cartItem.filter( obj => {
    //     return obj.id !== plan.id;
    //   });
    // } else {
    const plan = {...planDetails};
    plan.priceTotal = plan.price * planUnit.value;
    plan.unit = planUnit.value;
    this.cartItem.push(plan);
    // }
    this.subTotal = 0;
    if (this.cartItem.length > 0) {
      for (const item of this.cartItem) {
        this.subTotal += Number(item.priceTotal);
      }
    }
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 500);
  }

  onUpdateCart(cartProperty, i) {
    // const foundIndex = this.cartItem.findIndex(x => x.id == cart.id);
    this.cartItem[i].unit = cartProperty.value;
    this.cartItem[i].priceTotal = this.cartItem[i].price * cartProperty.value;
    this.subTotal = 0;
    if (this.cartItem.length > 0) {
      for (const item of this.cartItem) {
        this.subTotal += Number(item.priceTotal);
      }
    }
  }

  onRemoveCartItem(i, item) {
    this.cartItem.splice(i, 1);

    this.subTotal = 0;
    if (this.cartItem.length > 0) {
      for (const itemVal of this.cartItem) {
        this.subTotal += Number(itemVal.priceTotal);
      }
    }
  }

  onApplyCoupon() {
    this.loading.start();
    this.billingService.coupon(this.promoCode, this.constructor.name, moduleName.pricingModule).subscribe((res: any) => {
      this.loading.stop();
      this.percentOff = 0;
      if (res.response.valid) {
        this.isPromoCodeActive = true;
        this.isPromoCodeError = false;
        this.percentOff = res.response.percent_off;
      } else {
        // this.isOpen = true;
        this.isPromoCodeActive = false;
        this.isPromoCodeError = true;
        // this.alertMsg = 'Promo Code is not Valid';
        // this.alertType = 'danger';
      }
    }, error => {
      this.loading.stop();
      this.isPromoCodeActive = false;
      this.isPromoCodeError = true;
    });
  }

  private onCheckOut(response: any) {
    this.stripe.redirectToCheckout({
      sessionId: response
    }).then((result) => {
    }).catch(error => {
    });
  }

  onRemoveCoupon() {
    this.percentOff = 0;
    this.promoCode = null;
  }

  onGenerateSessionID() {
    if (this.quickDivID == undefined || (this.quickDivID == 0)) {
      this.loading.start()
      this.billingService.getManageSessionID(this.constructor.name, moduleName.manageSubscriptionsModule).subscribe((res: any) => {
        this.loading.stop();
        if (res.status === 200) {
          window.open(res.response, '_blank');
        }

      }, err => {
        this.loading.stop();
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      })
    } else if (this.quickDivID !== undefined && (this.quickDivID == 11 || this.quickDivID == 18 || this.quickDivID == 5)) {
      const indexId = this.quickDivID == 18 ? 5 : this.quickDivID == 11 ? 4 : 3;
      let quickLinkObj = {
        linkid: this.quickDivID,
        indexid: indexId,
        isactualbtnclicked: true,
        islinkclicked: true
      };
      this.quickmenuService.onClickEmitQSLinkobj.next(quickLinkObj);
      this.quickmenuService.updateQuerymenulist(quickLinkObj);
      const a = this.quickmenuService.getQuerymenulist();
      if (a.length !== 0) {
        const idx = a.findIndex((t) => t.index == quickLinkObj.indexid);
        if (a[idx].quicklinks.filter((t) => t.linkid == quickLinkObj.linkid).length > 0) {
          this.loading.start()
          this.billingService.getManageSessionID(this.constructor.name, moduleName.manageSubscriptionsModule).subscribe((res: any) => {
            this.loading.stop();
            if (res.status === 200) {
              this.userService.onRevistQuickStartmenulink.next({quickstartid:this.quickDivID,reclickqslink:true,urlchanged:false});
              this.quickmenuService.onClickEmitQSLinkobj.next(quickLinkObj);
              this.quickmenuService.updateQuerymenulist(quickLinkObj);
              this.checkForQsTooltip();
              window.open(res.response, '_blank');
            }

          }, err => {
            this.loading.stop();
            this.isOpen = true;
            this.alertMsg = err;
            this.alertType = 'danger';
          });
        }
      }
    }

   
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg', ignoreBackdropClick: true});
  }

  onSetCookieConsent(type, featureCompareType) {
    if (this.planDetails !== undefined) {
      this.currentFeature = featureCompareType;
      this.currentStep = type;
      this.cookieConsentBillingCycle = 'monthly';
      this.subscriptionList = this.planDetails.cookieConsent[`${this.cookieConsentBillingCycle}`];
      this.dsarPlanList = this.planDetails.dsar[`${this.cookieConsentBillingCycle}`];
      this.consentPreferenceList = this.planDetails.consentPreference[`${this.cookieConsentBillingCycle}`];
    }
  }

  ngAfterViewInit(){
    this.quickmenuService.onClickEmitQSLinkobj.subscribe((res) => { 
      this.quickDivID = res.linkid;
    });
  //  this.onGetPlanDetails();
    this.cdRef.detectChanges();
    if(this.planDetails !== undefined){
      this.callForQuickStart();
    }
  }

  callForQuickStart(){
    this.cookieConsentBillingCycle = "monthly";
    const quicklinks = this.quickmenuService.qsMenuobjwithIndexid;
    if (quicklinks !== undefined && quicklinks.linkid == 11) {
      this.currentStep = 2;
      this.onSetCookieConsent(2, 'dsar');
    }else if (quicklinks !== undefined && quicklinks.linkid == 18) {
      this.currentStep = 3;
      this.onSetCookieConsent(3, 'consentPreference');
    }else if (quicklinks !== undefined && quicklinks.linkid == 5) {
      this.currentStep = 1;
      this.onSetCookieConsent(1, 'cookieConsent');
    } 
  }


  checkForQsTooltip(){
    this.userService.onRevistQuickStartmenulink.next({quickstartid:this.quickDivID,reclickqslink:true,urlchanged:true}); 
    this.quickDivID = "";    
  }

}
