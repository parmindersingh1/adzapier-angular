import { Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import { BillingService } from 'src/app/_services/billing.service';
import { CompanyService } from 'src/app/company.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  isSuccess = false;
  isError = false;
  billingDetails;
  companyDetails;
  constructor(private activatedRoute: ActivatedRoute,
              private billingService: BillingService,
              private companyService: CompanyService,
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

}