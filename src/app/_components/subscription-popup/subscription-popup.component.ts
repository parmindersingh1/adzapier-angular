import {Component, OnInit, ViewChild} from '@angular/core';
import {moduleName} from '../../_constant/module-name.constant';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {BillingService} from '../../_services/billing.service';
import {AuthenticationService} from '../../_services';
import {CCPAFormConfigurationService} from '../../_services/ccpaform-configuration.service';
import {DsarformService} from '../../_services/dsarform.service';
import {DataService} from '../../_services/data.service';
import {Router} from '@angular/router';
import {mainPlans} from '../../_constant/main-plans.constant';

class DefaultPlanData {
  plan_name: '';
  price: 0;
  product_name: '';
  stripe_plan_id: '';
}

@Component({
  selector: 'app-subscription-popup',
  templateUrl: './subscription-popup.component.html',
  styleUrls: ['./subscription-popup.component.scss']
})
export class SubscriptionPopupComponent implements OnInit {
  modalRef: BsModalRef;
  cookieConsentPlans = [];
  @ViewChild('template', {static: true}) template: any;
  allPlanData: any;
  billingCycle = 'monthly';
  currentPlanData = new DefaultPlanData();
  type = 'cookieConsent';
  msg = '';
  mainFeatures = mainPlans;
  dsarPlans: any;
  existingOrgPlan = null;
  noPlanType = 'org';
  isUserSubscribe = false;
  showFeatureCount = 6;

  constructor(
    private modalService: BsModalService,
    private billingService: BillingService,
    private authenticationService: AuthenticationService,
    private ccpaFormConfigurationService: CCPAFormConfigurationService,
    private dsarformService: DsarformService,
    private dataService: DataService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.onGetPlanDetails();
    this.onGetUserSubscriptions()
    this.openModal();
  }

  onGetUserSubscriptions() {
    this.billingService.getActivePlan(this.constructor.name, moduleName.manageSubscriptionsModule).subscribe((res: any) => {
      // this.isUserSubscribe = res.response.length;
      if (res.status === 200) {
        const result = res.response;
        for (const obj of result) {
          if (obj.active) {
            this.isUserSubscribe = true;
          }
        }
      }
    });
  }


  openModal() {
    this.dataService.openModalWithData.subscribe(res => {
      if (res.hasOwnProperty('msg')) {
        this.msg = res.msg;
      }
      if (res.openModal) {
        if (!res.data) {
          this.currentPlanData = new DefaultPlanData();
        }
        if (res.type) {
          this.noPlanType = res.type;
        }
        if (res.data) {
          if (Object.keys(res.data).length !== 0) {
            this.type = res.type;
            this.currentPlanData = res.data;
            if (res.currentplan !== undefined) {
              this.existingOrgPlan = res.currentplan;
            }
          } else if (!res.data && res.type == 'org') {
            this.type = 'org'
            this.currentPlanData = new DefaultPlanData();
          } else {
            this.type = 'noPlan'
            this.currentPlanData = new DefaultPlanData();
          }
        } else {
          this.type = 'noPlan'
        }
        this.template.show();
      }
    })
  }

  onGetPlanDetails() {
    this.billingService.getCurrentPlanInfo(this.constructor.name, moduleName.pricingModule).subscribe((res: any) => {
      this.allPlanData = res.response;
      this.onSetEnterPrice();
      this.cookieConsentPlans = this.allPlanData.base[`${this.billingCycle}`];
      this.dsarPlans = this.allPlanData.addons[`${this.billingCycle}`]
      // this.subscriptionList = res.response.monthly;
    }, error => {
    });
  }

  onSetEnterPrice() {
    this.allPlanData.base['yearly'].push({
      cycle: 'Enterprise',
      description: '',
      id: '',
      name: 'Enterprise',
      price: -1,
      product_name: 'Advanced enterprise features and global coverage.',
      type: 0
    });

    this.allPlanData.addons['monthly'].push({
      cycle: 'Enterprise',
      description: '',
      id: '',
      name: 'Enterprise',
      price: -1,
      product_name: 'Advanced enterprise features and global coverage.',
      type: 0
    });
    this.allPlanData.addons['yearly'].push({
      cycle: 'Enterprise',
      description: '',
      id: '',
      name: 'Enterprise',
      price: -1,
      product_name: 'Advanced enterprise features and global coverage.',
      type: 0
    });
  }

  onSelectBillingCycle(e) {
    if (e.checked) {
      this.billingCycle = 'yearly';
      this.cookieConsentPlans = this.allPlanData.base[`${this.billingCycle}`]
      this.dsarPlans = this.allPlanData.addons[`${this.billingCycle}`]

    } else {
      this.billingCycle = 'monthly';
      this.cookieConsentPlans = this.allPlanData.base[`${this.billingCycle}`]
      this.dsarPlans = this.allPlanData.addons[`${this.billingCycle}`]
    }
  }

  onNavigate() {
    this.template.hide();
    this.router.navigateByUrl('/settings/billing/pricing')
  }


}
