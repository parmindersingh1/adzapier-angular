import { Component, OnInit } from '@angular/core';
import {BillingService} from '../_services/billing.service';
import { CompanyService } from '../company.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {environment} from '../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {notificationConfig} from '../_constant/notification.constant';



@Component({
  selector: 'app-update-billing',
  templateUrl: './update-billing.component.html',
  styleUrls: ['./update-billing.component.scss']
})
export class UpdateBillingComponent implements OnInit {
  sessionId = '';
  billingDetails: any = {
    billing_details: {},
    billing_history: {},
    company_details: {}
  };
  stripe = (window as any).Stripe(environment.stripePublishablekey);
  queryParams: any = {
    success: false,
    sessionId: '',
    error: false,
  };
  companyDetails: any = { name: ''};

  constructor(
    private billingService: BillingService,
    private companyService: CompanyService,
    private notification: NotificationsService,
    private loading: NgxUiLoaderService,
    private activatedRoute: ActivatedRoute
  ) { }



  ngOnInit() {
    this.onGetStatus();
    this.onGetCurrentPlan();
    this.onGetCompanyDetails();
    this.onGetSessionId();
  }
  onGetStatus() {
    this.activatedRoute.queryParams.subscribe(res => {
      if (res['success'] === 'true') {
        this.queryParams = res;
        this.queryParams.success = true;
      }
      if (res['success'] === 'false') {
          this.queryParams.success = false;
          this.queryParams.error = true;
        }
    });
  }

  onGetSessionId() {
    this.loading.start('1');
    this.billingService.createSessionId().subscribe(res => {
      this.loading.stop('1');
      if (res['status'] === 200) {
        this.sessionId = res['response'];
      }
    }, error => {
      this.loading.stop('1');
      this.notification.error('Session Id', 'Something went wrong...', notificationConfig);
    });
  }
  onGetCurrentPlan() {
    this.loading.start('2');
    this.billingService.getCurrentPlan().subscribe(res => {
      this.loading.stop('2');
      if (res['status'] === 200) {
        this.billingDetails = res['response'];
        console.log(this.billingDetails);
      }
    }, error => {
      this.loading.stop('2');
      this.notification.error('Current Plan', 'Something went wrong...', notificationConfig);
    });
  }
  onGetCompanyDetails() {
    this.loading.start('3');
    this.companyService.getCompanyDetails().subscribe(res => {
      this.loading.stop('3');
      if (res['status'] === 200) {
        this.companyDetails = res['response'];
      }
    }, error => {
      this.loading.stop('3');
      this.notification.error('Company Details', 'Something went wrong...', notificationConfig);
    });
  }

  onUpdateCheckout() {
    if (this.sessionId) {
      this.stripe.redirectToCheckout({
        sessionId: this.sessionId
      }).then((result) => {

      }).catch(error => {
        this.notification.error('Checkout', error, notificationConfig);
      });
    }
  }
}
