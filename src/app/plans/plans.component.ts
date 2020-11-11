import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { subscriptionPlan } from '../_constant/pricing.contant';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
  subscriptionPlan;
  billingCycle = 'MONTHLY';
  subscriptionPlanType = 'CCPA';
  constructor(private router: Router,
  ) { }

  ngOnInit() {
    this.onSetValue();
  }
  onSelectPlan(plan) {
    this.router.navigate(['/pricing'], { queryParams: { url: window.location.pathname }, queryParamsHandling: "merge" });
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
    } else if  (this.billingCycle === 'YEARLY' && this.subscriptionPlanType === 'CCPA') {
      this.subscriptionPlan = subscriptionPlan.CCPA.YEARLY;
    } else if (this.billingCycle === 'MONTHLY' && this.subscriptionPlanType === 'GDPR') {
      this.subscriptionPlan = subscriptionPlan.GDPR.MONTHLY;
    } else if (this.billingCycle === 'YEARLY' && this.subscriptionPlanType === 'GDPR') {
      this.subscriptionPlan = subscriptionPlan.GDPR.YEARLY;
    }
  }
}
