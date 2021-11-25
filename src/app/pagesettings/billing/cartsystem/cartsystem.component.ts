import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { moduleName } from 'src/app/_constant/module-name.constant';
import { BillingService } from 'src/app/_services/billing.service';

@Component({
  selector: 'app-cartsystem',
  templateUrl: './cartsystem.component.html',
  styleUrls: ['./cartsystem.component.scss']
})
export class CartsystemComponent implements OnInit {
  currentStep:any = 0;
  count: string[];
  counttwo: number;
  result = [];
  cartRecordList = [];
  cartRecordCount: any;
  subTotal = 0;
  cartID: any;
  percentOff = 0;
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  step = 0;
  isPromoCodeActive = false;
  isPromoCodeError = false;
  promoCode: any;
  consentPref = [];
  cookieConsent = [];
  dsar = [];
  queryOID: string;
  queryPID: string;
  cookiesubTotal: number;
  DsarsubTotal: number;
  consentsubTotal: number;
  

  constructor(private billingService : BillingService,
    private loading: NgxUiLoaderService,
    private activatedroute: ActivatedRoute,

    ) {

   }

  ngOnInit() {
    this.billingService.PlanDetails.subscribe(res => {
      this.result = res;
     
      if (Object.keys(res).length > 0) {
        this.result = res;
        this.count = Object.keys(res);
        this.counttwo = this.count.length;
      
      }
    }, error => {
      console.error(error);

    });
    this.onGetCartRecord();
    this.activatedroute.queryParamMap
 .subscribe(params => {
   this.queryOID = params.get('oid');
   this.queryPID = params.get('pid');
   //console.log(this.queryOID,'queryOID210..');
   //console.log(this.queryPID,'queryPID211..');
  });
    const element = document.getElementById('main');
    element.classList.remove('container');
    element.classList.remove('site-content');
    element.classList.add('container-fluid');
    element.style.padding = '0px';
    element.style.margin = '0px';
  }

  CurrentOpen(){
    this.currentStep = 0;
  }

  CurrentOpenOne(){
    this.currentStep = 1;
  }

  CurrentOpenTwo(){
    this.currentStep = 2;
  }

  CurrentOpenThree(){
    this.currentStep = 3;
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
          this.cookiefilter(this.cartRecordList);
          this.DsarFilter(this.cartRecordList);
          this.consentPrefFilter(this.cartRecordList);
      
          
        }
      }, error => {
        this.loading.stop();
      });
  }

  cookiefilter(cartRecord){
    this.cookieConsent = cartRecord.filter(t => t.Type == 0);
    this.cookiesubTotal = 0 ;
          if (this.cookieConsent.length > 0) {
            for (const item of this.cookieConsent) {
              this.cookiesubTotal += Number(item.Price * item.Quantity);
            }
          }
  }

  DsarFilter(cartRecord){
    this.dsar = cartRecord.filter(t => t.Type == 1);
    this.DsarsubTotal = 0 ;
          if (this.dsar.length > 0) {
            for (const item of this.dsar) {
              this.DsarsubTotal += Number(item.Price * item.Quantity);
            }
      }
  }

  consentPrefFilter(cartRecord){
    this.consentPref = cartRecord.filter(t => t.Type == 2);
    this.consentsubTotal = 0 ;
          if (this.consentPref.length > 0) {
            for (const item of this.consentPref) {
              this.consentsubTotal += Number(item.Price * item.Quantity);
            }
          }
  }

  next(){
    this.step = 1;
  }

  prev(){
    this.step = 0;
  }

  Add(cartProperty,i,cartId){
    cartProperty.value++;
    this.cartRecordList[i].CartId =  cartId.value;
    this.cartRecordList[i].Quantity = cartProperty.value;
    this.cartRecordList[i].Price = this.cartRecordList[i].Price * cartProperty.value;

    this.onUpdateCartRecord(this.cartRecordList[i].CartId , this.cartRecordList[i].Quantity)
  }

  Subs(cartProperty,i,cartId){
    if(cartProperty.value > 1){
      cartProperty.value--;
      this.cartRecordList[i].CartId =  cartId.value;
      this.cartRecordList[i].Quantity = cartProperty.value;
      this.cartRecordList[i].Price = this.cartRecordList[i].Price * cartProperty.value;
  
      this.onUpdateCartRecord(this.cartRecordList[i].CartId , this.cartRecordList[i].Quantity)
    }
  }
  
  onNavigateToDetails(plandata) {
    this.billingService.onPushPlanData(plandata);
     //await this.router.navigateByUrl('/consent-solutions/consent-records/details/' + consentRecord.id);
   }
   
 

  onUpdateCart(cartProperty, i , cartId) {
    // const foundIndex = this.cartItem.findIndex(x => x.id == cart.id);
    this.cartRecordList[i].CartId =  cartId.value;
    this.cartRecordList[i].Quantity = cartProperty.value;
    this.cartRecordList[i].Price = this.cartRecordList[i].Price * cartProperty.value;

    this.onUpdateCartRecord(this.cartRecordList[i].CartId , this.cartRecordList[i].Quantity)

  }


  onUpdateCartRecord(ids , cartProp) {
    this.isOpen = false;
    this.loading.start();
    const payload={
      id:ids ,
      quantity: Number(cartProp),
    }
    
    this.billingService.UpdateCart(this.constructor.name, moduleName.billingModule , payload)
      .subscribe((res: any) => {
        this.loading.stop();
        const result: any = res;
        if (result.status === 200) {
         this.isOpen = true;
         this.alertMsg = result.message;
         this.alertType = 'success';
         this.onGetCartRecord();
        }
      }, error => {
        this.loading.stop();
      });
  }

  onRemoveCartItem(i, cartId) {
    // this.cartRecordList.splice(i, 1);
    this.cartRecordList[i].CartId = cartId.value;

    this.onRemoveItem(this.cartRecordList[i].CartId);

  }

  onRemoveItem(id){
    this.isOpen = false;
    this.loading.start();
    
    this.billingService.DeleteCart(this.constructor.name, moduleName.billingModule , id)
      .subscribe((res: any) => {
        this.loading.stop();
        const result: any = res;
        if (result.status === 200) {
         this.isOpen = true;
         this.alertMsg = result.message;
         this.alertType = 'success';
         this.onGetCartRecord();
        }
      }, error => {
        this.loading.stop();
      });
  

  }

  onApplyCoupon() {
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

  onRemoveCoupon() {
    this.percentOff = 0;
    this.promoCode = null;
  }


}
