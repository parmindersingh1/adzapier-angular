import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingService } from 'src/app/_services/billing.service';
import { NotificationsService } from 'angular2-notifications';
import { CompanyService } from 'src/app/company.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { notificationConfig } from 'src/app/_constant/notification.constant';


@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  isSuccess = false;
  isError = false;
  billingDetails: any = {
    billing_details: {},
    billing_history: {},
    company_details: {}
  };
  companyDetails: any = { name: '' };
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private billingService: BillingService,
              private companyService: CompanyService,
              private notification: NotificationsService,
              private loading: NgxUiLoaderService
  ) {

  }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.success === 'true') {
        this.isSuccess = true;
      } else if (params.success === 'false') {
        this.isError = true;
      }
    });
    this.onGetCurrentPlan();
    this.onGetCompanyDetails();
  }

  onGetCurrentPlan() {
    this.loading.start();
    this.billingService.getCurrentPlan().subscribe(res => {
      this.loading.stop();
      if (res['status'] === 200) {
        console.log(typeof (res['response']));
        if (typeof (res['response']) === 'string') {
          //  this.notification.info('No Current Plan', 'You have not Subscribed with any plan...', notificationConfig);
          this.isOpen = true;
          this.alertMsg = 'You have not Subscribed with any plan...';
          this.alertType = 'info';
          this.router.navigateByUrl('/pricing');
        } else {
          this.billingDetails = res['response'];
        }
      }
    }, error => {
      this.loading.stop();
      this.isOpen = true;
      this.alertMsg = error;
      this.alertType = 'danger';
      // this.notification.error('Current Plan', 'Something went wrong...', notificationConfig);
    });
    setTimeout(() => {
      this.loading.stop();
    }, 4000);
  }

  onGetCompanyDetails() {
    this.companyService.getCompanyDetails().subscribe(res => {
      if (res['status'] === 200) {
        this.companyDetails = res['response'];
      }
    }, error => {
      this.isOpen = true;
      this.alertMsg = error;
      this.alertType = 'danger';
     // this.notification.error('Company Details', 'Something went wrong...', notificationConfig);
    });
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

}
