import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { moduleName } from 'src/app/_constant/module-name.constant';
import { UserService } from 'src/app/_services';
import { BillingService } from 'src/app/_services/billing.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cartreview',
  templateUrl: './cartreview.component.html',
  styleUrls: ['./cartreview.component.scss']
})


export class CartreviewComponent implements OnInit {
  cartRecordList = [];
  cartRecordCount: number;
  subTotal: number;
  isPromoCodeActive = false;
  isPromoCodeError = false;
  stripe = (window as any).Stripe(environment.stripePublishablekey);
  promoCode: any;
  percentOff = 0;
  userEmail: any;
  isOpen: boolean;
  alertMsg: any;
  alertType: string;
  dismissible = true;
  queryOID: string;
  queryPID: string;

  constructor(private billingService : BillingService,
    private loading: NgxUiLoaderService,
    private userService : UserService,
    private activatedroute: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.onGetCartRecord();
    this.onGetUserEmail();
    const element = document.getElementById('main');
    element.classList.remove('container');
    element.classList.remove('site-content');
    element.classList.add('container-fluid');
    element.style.padding = '0px';
    element.style.margin = '0px';

    this.activatedroute.queryParamMap
 .subscribe(params => {
   this.queryOID = params.get('oid');
   this.queryPID = params.get('pid');
 });
  }

  onGetUserEmail() {
    this.loading.start();
    this.userService.getLoggedInUserDetails(this.constructor.name, moduleName.pricingModule).subscribe(res => {
      this.loading.stop();
      const result: any = res;
      if (result.status === 200) {
        this.userEmail = result.response.email;
      }
    }, error => {
      this.loading.stop();
      console.log(error);
    });
  }

  onSelectPlan() {
    const plans = [];
    for (const pricing of this.cartRecordList) {
      plans.push({plan_id: pricing.StripePlanId, units: pricing.Quantity.toString()});
    }
    if (this.userEmail) {
      let payloads = {};
      payloads = {
        coupon_code: this.isPromoCodeActive ? this.promoCode : '',
        plan_details: plans,
        email: this.userEmail
      };
      this.loading.start();
      this.billingService.getSessionId(payloads, this.constructor.name, moduleName.pricingModule).subscribe(res => {
        this.loading.stop();
        const result: any = res;
        if (result.status === 200) {
          this.onCheckOut(result.response);
        }
      }, error => {
        this.loading.stop();
        const err: any = JSON.parse(error);
        this.isOpen = true;
        this.alertMsg = err.message;
        this.alertType = 'danger';
      });
    } else {
      location.reload();
    }
  }

  private onCheckOut(response: any) {
    this.stripe.redirectToCheckout({
      sessionId: response
    }).then((result) => {
    }).catch(error => {
    });
  }

  onGetCartRecord() {
    this.loading.start();
    
    this.billingService.GetCart(this.constructor.name, moduleName.billingModule)
      .subscribe((res: any) => {
        this.loading.stop();
        const result: any = res;
        if (result.status === 200) {
         
          this.cartRecordList = result.response;
          this.cartRecordCount = Number(result.count);
          this.onNavigateToDetails(this.cartRecordCount)
          this.subTotal = 0 ;
          if (this.cartRecordList.length > 0) {
            for (const item of this.cartRecordList) {
              this.subTotal += Number(item.Price * item.Quantity);
            }
          }
      
          
        }
      }, error => {
        this.loading.stop();
      });
  }

  onNavigateToDetails(plandata) {
    this.billingService.onPushPlanData(plandata);
     //await this.router.navigateByUrl('/consent-solutions/consent-records/details/' + consentRecord.id);
   }

   onApplyCoupon() {
     if(this.promoCode.toString() !== ''){
    this.loading.start();
    this.billingService.coupon(this.promoCode, this.constructor.name, moduleName.pricingModule).subscribe((res: any) => {
      this.loading.stop();
      this.percentOff = 0;
      if (res.response.valid) {
        this.isPromoCodeActive = true;
        this.isPromoCodeError = false;
        this.percentOff = res.response.percent_off;
      } else {
        // this.isOpen = true;
        this.isPromoCodeActive = false;
        this.isPromoCodeError = true;
        // this.alertMsg = 'Promo Code is not Valid';
        // this.alertType = 'danger';
      }
    }, error => {
      this.loading.stop();
      this.isPromoCodeActive = false;
      this.isPromoCodeError = true;
    });
  }
}

  onRemoveCoupon() {
    this.percentOff = 0;
    this.promoCode = null;
  }

}
