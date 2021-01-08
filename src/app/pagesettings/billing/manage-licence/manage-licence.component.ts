import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { moduleName } from 'src/app/_constant/module-name.constant';
import { BillingService } from 'src/app/_services/billing.service';

@Component({
  selector: 'app-manage-subscription',
  templateUrl: './manage-licence.component.html',
  styleUrls: ['./manage-licence.component.scss']
})
export class ManageLicenceComponent implements OnInit {
  activeSubscriptionList = [];
  alertMsg: any;
  isOpen = false;
  skLoading = false;
  alertType: any;
  isSuccess: boolean;
  isError: boolean;
  showManageText = false;
  inActiveplans = [];

  constructor(
    private loading: NgxUiLoaderService,
    private billingService: BillingService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.success === 'true') {
        this.isSuccess = true;
      } else if (params.success === 'false') {
        this.isError = true;
      }
      if(params.hasOwnProperty('type')) {
        this.showManageText = true;
      }
    });
    this.onGetActivePlan()
  }

  onGetActivePlan() {
      this.loading.start()
      this.skLoading = true;
      this.billingService.getActivePlan(this.constructor.name, moduleName.manageSubscriptionsModule).subscribe( (res: any) => {
        this.loading.stop();
        this.skLoading = false;
        this.activeSubscriptionList = res.response;
        this.inActiveplans = [];
        for(const isActive of res.response) {
          if(!isActive.active) {
            this.inActiveplans.push(isActive)
          }
        }
      }, err => {
        this.loading.stop();
        this.skLoading = false;
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      })
  }

  onGenerateSessionID() {
    this.loading.start()
    this.billingService.getManageSessionID(this.constructor.name, moduleName.manageSubscriptionsModule).subscribe( (res: any) => {
      this.loading.stop();
      if(res.status === 200) {
        window.open(res.response, '_blank');
      }

    }, err => {
      this.loading.stop();
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
