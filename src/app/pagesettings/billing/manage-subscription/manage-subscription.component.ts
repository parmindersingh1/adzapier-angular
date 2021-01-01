import { Component, OnInit } from '@angular/core';
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
    private billingService: BillingService
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
}
