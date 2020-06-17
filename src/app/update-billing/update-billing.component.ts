import { Component, OnInit } from '@angular/core';
import {BillingService} from "../_services/billing.service";
import {CompanyService} from "../company.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {environment} from "../../environments/environment.develop";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-update-billing',
  templateUrl: './update-billing.component.html',
  styleUrls: ['./update-billing.component.scss']
})
export class UpdateBillingComponent implements OnInit {
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
    private loading: NgxUiLoaderService,
    private activatedRoute: ActivatedRoute
  ) { }

  

  ngOnInit() {
    this.onGetStatus();
    this.onGetCurrentPlan();
    this.onGetCompanyDetails();
  }
  onGetStatus() {
    this.activatedRoute.queryParams.subscribe(res => {
      if (res.success == 'true') {
        this.queryParams = res;
        this.queryParams.success = true;
      }
      if (res.success == 'false') {
          this.queryParams.success = false;
          this.queryParams.error = true;
        }
    });
  }

  onGetCurrentPlan() {
    this.loading.start();
    this.billingService.getCurrentPlan().subscribe(res => {
      this.loading.stop();
      if (res['status'] === 200) {
        this.billingDetails = res['response'];
        console.log(this.billingDetails);
      }
    }, error => {
      this.loading.stop();
      console.log(error);
    });
  }
  onGetCompanyDetails() {
    this.companyService.getCompanyDetails().subscribe(res => {
      if (res['status'] === 200) {
        this.companyDetails = res['response'];
      }
    }, error => {
      console.log(error);
    });
  }

  onUpdateCheckout() {
    this.stripe.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: 'cs_test_o7OVL9oxKVPPPS34BBEOnQvzogLwWYp4aWc30GmfcUEesfrBf6MZpGRZ'
    }).then((result) => {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
    });
  }
}
