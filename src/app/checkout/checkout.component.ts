import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {DataService} from '../_services/data.service';
import {BillingService} from '../_services/billing.service';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  planDetails;
  stripe = (window as any).Stripe(environment.stripePublishablekey);
  constructor(private router: Router,
              private loading: NgxUiLoaderService,
              private dataService: DataService,
              private billingService: BillingService) { }

  ngOnInit() {
    this.dataService.getBillingPlanDetails.subscribe(res => {
      console.log(res);
      if (res) {
       this.planDetails = res;
      } else {
        this.router.navigateByUrl('/pricing');
      }
    });
  }

  onCheckout() {
    this.stripe.redirectToCheckout({
      sessionId: this.planDetails.sessionId
    }).then( (result) => {
      console.log(result);
    }).catch( error => {
      console.log(error);
    });
  }

}
