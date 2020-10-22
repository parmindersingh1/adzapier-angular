import { Component, OnInit } from '@angular/core';
import { BillingService } from 'src/app/_services/billing.service';
import { CompanyService } from 'src/app/company.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { notificationConfig } from 'src/app/_constant/notification.constant';
import {moduleName} from '../../../_constant/module-name.constant';



@Component({
  selector: 'app-update-billing',
  templateUrl: './update-billing.component.html',
  styleUrls: ['./update-billing.component.scss']
})
export class UpdateBillingComponent implements OnInit {
  sessionId = '';
  billingDetails: any = {
    billing_details: null,
    billing_history: null,
    company_details: null
  };
  stripe = (window as any).Stripe(environment.stripePublishablekey);
  queryParams: any = {
    success: false,
    sessionId: '',
    error: false,
  };
  companyDetails: any = { name: '' };
  alertMsg: any;
  alertType: any;
  dismissible = true;
  isOpen = false;
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
    this.activatedRoute.queryParams.subscribe((res: any) => {
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
    this.billingService.createSessionId(this.constructor.name, moduleName.updateBillingModule).subscribe((res: any) => {
      this.loading.stop('1');
      if (res['status'] === 200) {
        this.sessionId = res['response'];
      }
    }, error => {
      this.loading.stop('1');
      this.alertMsg = error;
      this.isOpen = true;
      this.alertType = 'danger';
     // this.notification.error('Session Id', 'Something went wrong...', notificationConfig);
    });
  }
  onGetCurrentPlan() {
    this.loading.start('2');
    this.billingService.getCurrentPlan(this.constructor.name, moduleName.updateBillingModule).subscribe((res: any) => {
      this.loading.stop('2');
      if (res['status'] === 200) {
        this.billingDetails = res['response'];
        console.log(this.billingDetails);
      }
    }, error => {
      this.loading.stop('2');
      this.alertMsg = error;
      this.isOpen = true;
      this.alertType = 'danger';
     // this.notification.error('Current Plan', 'Something went wrong...', notificationConfig);
    });
  }
  onGetCompanyDetails() {
    this.loading.start('3');
    this.companyService.getCompanyDetails(this.constructor.name, moduleName.updateBillingModule).subscribe((res: any) => {
      this.loading.stop('3');
      if (res['status'] === 200) {
        this.companyDetails = res['response'];
      }
    }, error => {
      this.loading.stop('3');
      this.alertMsg = error;
      this.isOpen = true;
      this.alertType = 'danger';
     // this.notification.error('Company Details', 'Something went wrong...', notificationConfig);
    });
  }

  onUpdateCheckout() {
    if (this.sessionId) {
      this.stripe.redirectToCheckout({
        sessionId: this.sessionId
      }).then((result) => {

      }).catch(error => {
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
       // this.notification.error('Checkout', error, notificationConfig);
      });
    }
  }
}