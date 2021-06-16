import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BillingService} from '../../../_services/billing.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {DataService} from '../../../_services/data.service';
import {UserService} from '../../../_services';
import {moduleName} from '../../../_constant/module-name.constant';
import {environment} from '../../../../environments/environment';
import {featureCount, highLightFeatures} from '../../../_constant/main-plans.constant';
@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit, OnDestroy {
  subscriptionPlan;
  planDetails: any;
  dsarPlanList: any;
  consentPreferenceList: any;
  skeletonLoader = false;
  highLightFeatures = highLightFeatures;
  featureCount = featureCount;
  subscriptionList = [];
  cookieConsentBillingCycle = 'monthly';
  addonsBillingCycle = 'monthly';
  stripe = (window as any).Stripe(environment.stripePublishablekey);
  cartItem = [];
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

  constructor(private router: Router,
              private loading: NgxUiLoaderService,
              private dataService: DataService,
              private userService: UserService,
              private billingService: BillingService) {
  }

  ngOnInit() {
    this.onGetPlanCompareData()
    this.onGetActivePlan();
    this.onGetPlanDetails();
    this.onGetUserEmail();
    // this.onSetValue();
    // this.onGetCurrentPlan();
    // const div = document.querySelector('#main');
    // div.classList.remove('container');
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
    const activeData = this.activeData;
    for (const data of record) {
      if (data.active && data.planDetails.type === 0) {
        if (data.planDetails.price > activeData.cookieConsent.maxPrice) {
          activeData.cookieConsent.maxPrice = data.planDetails.price;
          activeData.cookieConsent.maxPlanID = data.planDetails.stripe_plan_id;
          activeData.cookieConsent.cycle = data.planDetails.cycle;
          this.cookieConsentBillingCycle = data.planDetails.cycle;
        }
      } else {
        if (data.planDetails.price > activeData.dsar.maxPrice && data.active) {
          activeData.dsar.maxPrice = data.planDetails.price;
          activeData.dsar.maxPlanID = data.planDetails.stripe_plan_id;
          activeData.dsar.cycle = data.planDetails.cycle;
          this.addonsBillingCycle = data.planDetails.cycle;
        }
      }
    }
    this.activeData = activeData;
    this.subscriptionList = this.planDetails.cookieConsent[`${this.cookieConsentBillingCycle}`];
    this.dsarPlanList = this.planDetails.dsar[`${this.addonsBillingCycle}`];
    this.consentPreferenceList = this.planDetails.consentPreference[`${this.addonsBillingCycle}`];
  }

  onGetPlanDetails() {
    this.loading.start();
    this.skeletonLoader = true;
    this.billingService.getCurrentPlanInfo(this.constructor.name, moduleName.pricingModule).subscribe((res: any) => {
      this.loading.stop();
      this.skeletonLoader = false;
      this.planDetails = res.response;
      this.onSetPlans(res.response);
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
    this.dsarPlanList = plansData.dsar[`${this.addonsBillingCycle}`];
    this.consentPreferenceList = plansData.consentPreference[`${this.addonsBillingCycle}`];
  }

  ngOnDestroy() {
    const div = document.querySelector('#main');
    // div.classList.remove('container');
    div.classList.add('container');
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
        console.log(error);
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
    if (e.checked) {
      this.cookieConsentBillingCycle = 'yearly';
      this.subscriptionList = this.planDetails.cookieConsent[`${this.cookieConsentBillingCycle}`];
    } else {
      this.cookieConsentBillingCycle = 'monthly';
      this.subscriptionList = this.planDetails.cookieConsent[`${this.cookieConsentBillingCycle}`];
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
  }

}
