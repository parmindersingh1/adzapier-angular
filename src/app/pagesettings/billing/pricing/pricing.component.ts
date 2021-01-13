import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import { Router } from '@angular/router';
import { BillingService } from '../../../_services/billing.service';
import { subscriptionPlan } from '../../../_constant/pricing.contant';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DataService } from '../../../_services/data.service';
import { UserService } from '../../../_services';
import {moduleName} from '../../../_constant/module-name.constant';
import any = jasmine.any;
import {environment} from '../../../../environments/environment';
declare var jQuery: any;


class PlanDetails {
  addonss: any[];
  monthly: any[];
  yearly: any[];
}
@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit, OnDestroy {
  subscriptionPlan;
  planDetails: any;
  addonsList: any;
  skeletonLoader = false;
  subscriptionList = [];
  billingCycle = 'monthly';
  billingAddonCycle = 'monthly';
  stripe = (window as any).Stripe(environment.stripePublishablekey);
  cartItem = [];
  // subscriptionPlanType = 'CCPA';
  subTotal = 0;
  userEmail: any;
  discountPrice = 0;
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
 activeData = { base: {maxPrice : 0, maxPlanID: '', cycle: 'monthly'},
 addons: {maxPrice : 0, maxPlanID: '', cycle: 'monthly'}
};
  constructor(private router: Router,
              private loading: NgxUiLoaderService,
              private dataService: DataService,
              private userService: UserService,
              private billingService: BillingService) {
  }

  ngOnInit() {
    this.onGetActivePlan();
    this.onGetPlanDetails();
    this.onGetUserEmail();
    // this.onSetValue();
    // this.onGetCurrentPlan();
    // const div = document.querySelector('#main');
    // div.classList.remove('container');
  }

  onGetActivePlan() {
    this.loading.start()
    this.skeletonLoader = true;
    this.billingService.getActivePlan(this.constructor.name, moduleName.manageSubscriptionsModule).subscribe( (res: any) => {
      this.loading.stop();
      this.skeletonLoader = false;
      this.onSelectActivePlan(res.response)
    }, err => {
      this.loading.stop();
      this.skeletonLoader = false;
      this.isOpen = true;
      this.alertMsg = err;
      this.alertType = 'danger';
    })
}

onSelectActivePlan(record) {
  let activeData = this.activeData;
    for (const data of record) {
      if (data.active && data.planDetails.type === 0) {
        if(data.planDetails.price > activeData.base.maxPrice) {
          activeData.base.maxPrice = data.planDetails.price;
          activeData.base.maxPlanID = data.planDetails.stripe_plan_id;
          activeData.base.cycle = data.planDetails.cycle;
          this.billingCycle = data.planDetails.cycle;
        }
      } else {
        if(data.planDetails.price > activeData.addons.maxPrice) {
          activeData.addons.maxPrice = data.planDetails.price;
          activeData.addons.maxPlanID = data.planDetails.stripe_plan_id;
          activeData.addons.cycle = data.planDetails.cycle;
          this.billingAddonCycle = data.planDetails.cycle;
        }
      }
    }

   this.activeData = activeData;
   console.log('activeData', activeData)
   this.subscriptionList = this.planDetails.base[`${this.billingCycle}`];
   this.addonsList = this.planDetails.addons[`${this.billingAddonCycle}`];
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
  onSetPlans(plansData){
    this.subscriptionList = plansData.base[`${this.billingCycle}`];
    this.addonsList = plansData.addons[`${this.billingAddonCycle}`];
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
      plans.push({plan_id : pricing.id, units: pricing.unit});
    }
    if (this.userEmail) {
      let payloads = {};
      payloads = {
        coupon_code: this.promoCode ? this.promoCode : '',
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
      this.subscriptionList = this.planDetails[`${this.billingCycle}`];
    } else {
      // this.subscriptionPlanType = 'CCPA';
    }
  }

  onSelectBillingCycle(e) {
    if (e.checked) {
      this.billingCycle = 'yearly';
      this.billingAddonCycle = 'yearly';
      this.subscriptionList = this.planDetails.base[`${this.billingCycle}`];
      this.addonsList = this.planDetails.addons[`${this.billingAddonCycle}`];
    } else {
      this.billingCycle = 'monthly';
      this.billingAddonCycle = 'monthly';
      this.subscriptionList = this.planDetails.base[`${this.billingCycle}`];
      this.addonsList = this.planDetails.addons[`${this.billingAddonCycle}`];
    }
  }
  onGetCurrentPlan() {
    this.loading.start();
    this.billingService.getCurrentPlanInfo(this.constructor.name, moduleName.pricingModule).subscribe((res: any) => {
      this.loading.stop();
      if (!res.error) {
        this.currentPlan = res.response;
        this.billingCycle = res.response.duration === 'month' ? 'MONTHLY' : 'YEARLY';
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
    console.log('currentPlan', this.currentPlan);
    const payloads = {};
    // if (this.subscriptionPlanType === 'GDPR') {
    //   payloads = {
    //     service: [this.currentPlan.services.GDPR.key, this.currentPlan.services.CCPA.key],
    //     plan: plan.plan
    //   };
    // } else {
    //   payloads = {
    //     service: [this.currentPlan.services.CCPA.key],
    //     plan: plan.plan
    //   };
    // }
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
        this.percentOff = res.response.percent_off;
      } else {
        this.isOpen = true;
        this.alertMsg = 'Promo Code is not Valid';
        this.alertType = 'danger';
      }
    }, error => {
      this.loading.stop();
    });
  }

  private onCheckOut(response: any) {
    this.stripe.redirectToCheckout({
      sessionId: response
    }).then( (result) => {
      console.log(result);
    }).catch( error => {
      console.log(error);
    });
  }

  onRemoveCoupon() {
    this.percentOff = 0;
    this.promoCode = null;
  }
  onGenerateSessionID() {
    this.loading.start()
    this.billingService.getManageSessionID(this.constructor.name, moduleName.manageSubscriptionsModule).subscribe( (res: any) => {
      this.loading.stop();
      if(res.status === 200) {
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
