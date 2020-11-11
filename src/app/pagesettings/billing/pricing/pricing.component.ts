import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import { Router } from '@angular/router';
import { BillingService } from '../../../_services/billing.service';
import { subscriptionPlan } from '../../../_constant/pricing.contant';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DataService } from '../../../_services/data.service';
import { UserService } from '../../../_services';
import {moduleName} from '../../../_constant/module-name.constant';
declare var jQuery: any;

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit, OnDestroy {
  subscriptionPlan;
  billingCycle = 'MONTHLY';
  subscriptionPlanType = 'CCPA';
  userEmail: any;
  currentPlan = {
    amount: null,
    duration: null,
    services: null
  };
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  constructor(private router: Router,
              private loading: NgxUiLoaderService,
              private dataService: DataService,
              private userService: UserService,
              private billingService: BillingService) {
  }

  ngOnInit() {
    this.onGetUserEmail();
    this.onSetValue();
    this.onGetCurrentPlan();
    const div = document.querySelector('#main');
    div.classList.remove('container');
  }
  ngOnDestroy() {
    const div = document.querySelector('#main');
    // div.classList.remove('container');
    div.classList.add('container')
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

  onSelectPlan(plan) {
    if (this.userEmail) {

      let payloads = {};
      if (this.subscriptionPlanType === 'GDPR') {
        payloads = {
          service: [this.currentPlan.services.GDPR.key, this.currentPlan.services.CCPA.key],
          plan: plan.plan,
          email: this.userEmail
        };
      } else {
        payloads = {
          service: [this.currentPlan.services.CCPA.key],
          plan: plan.plan,
          email: this.userEmail
        };
      }
      console.log(this.billingCycle, this.subscriptionPlanType);
      this.loading.start();
      this.billingService.getSessionId(payloads, this.constructor.name, moduleName.pricingModule).subscribe(res => {
        this.loading.stop();
        const result: any = res;
        if (result.status === 200) {
          plan.sessionId = result.response;
          plan.planType = this.subscriptionPlanType;
          this.dataService.setBillingPlan(plan);
          this.router.navigateByUrl('/settings/billing/pricing/checkout');
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
      this.subscriptionPlanType = 'GDPR';
    } else {
      this.subscriptionPlanType = 'CCPA';
    }
    this.onSetValue();
  }

  onSelectBillingCycle(value) {
    this.billingCycle = value;
    this.onSetValue();
  }

  onSetValue() {
    if (this.billingCycle === 'MONTHLY' && this.subscriptionPlanType === 'CCPA') {
      this.subscriptionPlan = subscriptionPlan.CCPA.MONTHLY;
    } else if (this.billingCycle === 'YEARLY' && this.subscriptionPlanType === 'CCPA') {
      this.subscriptionPlan = subscriptionPlan.CCPA.YEARLY;
    } else if (this.billingCycle === 'MONTHLY' && this.subscriptionPlanType === 'GDPR') {
      this.subscriptionPlan = subscriptionPlan.GDPR.MONTHLY;
    } else if (this.billingCycle === 'YEARLY' && this.subscriptionPlanType === 'GDPR') {
      this.subscriptionPlan = subscriptionPlan.GDPR.YEARLY;
    }
  }

  onGetCurrentPlan() {
    this.loading.start();
    this.billingService.getCurrentPlanInfo(this.constructor.name, moduleName.pricingModule).subscribe((res: any) => {
      this.loading.stop();
      if (!res['error']) {
        this.currentPlan = res['response'];
        this.billingCycle = res['response']['duration'] === 'month' ? 'MONTHLY' : 'YEARLY';
        this.onSetValue();
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
    let payloads = {};
    if (this.subscriptionPlanType === 'GDPR') {
      payloads = {
        service: [this.currentPlan.services.GDPR.key, this.currentPlan.services.CCPA.key],
        plan: plan.plan
      };
    } else {
      payloads = {
        service: [this.currentPlan.services.CCPA.key],
        plan: plan.plan
      };
    }
    this.billingService.upGradePlan(payloads, this.constructor.name, moduleName.pricingModule).subscribe(res => {
      this.loading.stop();
      if (res['status'] === 200) {
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

}
