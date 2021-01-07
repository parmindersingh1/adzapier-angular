import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { moduleName } from 'src/app/_constant/module-name.constant';
import { BillingService } from 'src/app/_services/billing.service';

@Component({
  selector: 'app-manage-subscription',
  templateUrl: './manage-subscription.component.html',
  styleUrls: ['./manage-subscription.component.scss']
})
export class ManageSubscriptionComponent implements OnInit {
  activeSubscriptionList = [];
  alertMsg: any;
  isOpen = false;
  alertType: any;

  constructor(
    private loading: NgxUiLoaderService,
    private billingService: BillingService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.onGetActivePlan()
  }

  onGetActivePlan() {
      this.loading.start()
      this.billingService.getActivePlan(this.constructor.name, moduleName.manageSubscriptionsModule).subscribe( (res: any) => {
        this.loading.stop();
        this.activeSubscriptionList = res.response;
      }, err => {
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      })
  }

  onCalculateOptValue(val, totalConsent) {
    const cal = Math.ceil(val * 100 / totalConsent);
    if (isNaN(cal)) {
      return 0;
    } else {
      return cal;
    }
  }
}
