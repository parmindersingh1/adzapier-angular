import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {BillingService} from "../_services/billing.service";
import { subscriptionPlan } from '../_constant/pricing.contant';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {DataService} from "../_services/data.service";
import {UserService} from "../_services";

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  subscriptionPlan;
  billingCycle = 'MONTHLY';
  subscriptionPlanType = 'CCPA';
  userEmail: any;
  constructor(private router: Router,
              private loading: NgxUiLoaderService,
              private dataService: DataService,
              private userService: UserService,
              private billingService: BillingService) { }

  ngOnInit() {
    this.onGetUserEmail();
    this.onSetValue();
  }
  onGetUserEmail() {
    this.loading.start();
    this.userService.getLoggedInUserDetails().subscribe( res => {
      this.loading.stop();
      const result = res;
      if (result['status'] === 200) {
        this.userEmail = result['response']['email'];
      }
    }, error => {
      this.loading.stop();
      console.log(error);
    });
  }
  onSelectPlan(plan) {
    if (this.userEmail) {
      const data = {
        plan: plan.plan,
        email: this.userEmail
      };
      this.loading.start();
      this.billingService.getSessionId(data).subscribe(res => {
        this.loading.stop();
        const result = res;
        if (result['status'] === 200) {
          plan.sessionId = res['response'];
          plan.planType = this.subscriptionPlanType;
          this.dataService.setBillingPlan(plan);
          this.router.navigateByUrl('/checkout');
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
    } else if  (this.billingCycle === 'YEARLY' && this.subscriptionPlanType === 'CCPA') {
      this.subscriptionPlan = subscriptionPlan.CCPA.YEARLY;
    } else if (this.billingCycle === 'MONTHLY' && this.subscriptionPlanType === 'GDPR') {
      this.subscriptionPlan = subscriptionPlan.GDPR.MONTHLY;
    } else if (this.billingCycle === 'YEARLY' && this.subscriptionPlanType === 'GDPR') {
      this.subscriptionPlan = subscriptionPlan.GDPR.YEARLY;
    }
  }
}