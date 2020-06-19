import { Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BillingService} from "../_services/billing.service";
import {CompanyService} from "../company.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {notificationConfig} from "../_constant/notification.constant";
import {NotificationsService} from "angular2-notifications";

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
  companyDetails: any = { name: ''};
  constructor(private activatedRoute: ActivatedRoute,
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
        this.billingDetails = res['response'];
      }
    }, error => {
      this.loading.stop();
      this.notification.error('Current Plan', 'Something went wrong...', notificationConfig);
    });
  }

  onGetCompanyDetails() {
    this.companyService.getCompanyDetails().subscribe(res => {
      if (res['status'] === 200) {
       this.companyDetails = res['response'];
     }
    }, error => {
      this.notification.error('Company Details', 'Something went wrong...', notificationConfig);
    });
  }

}
