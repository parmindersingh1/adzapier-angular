import {Component, OnInit, ViewChild} from '@angular/core';
import {faCoffee} from '@fortawesome/free-solid-svg-icons';
import {AuthenticationService, OrganizationService} from './_services';
import {NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterEvent} from '@angular/router';
import * as feather from 'feather-icons';
import {CCPAFormConfigurationService} from './_services/ccpaform-configuration.service';
import {DsarformService} from './_services/dsarform.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {DataService} from './_services/data.service';
import {moduleName} from './_constant/module-name.constant';
import {BillingService} from './_services/billing.service';

class DefaultPlanData {
  plan_name: '';
  price: 0;
  product_name: '';
  stripe_plan_id: '';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // encapsulation: ViewEncapsulation.None

})
export class AppComponent implements OnInit {
  modalRef: BsModalRef;
  listAllPlans = [];
  @ViewChild('template', {static: true}) template: any;
  @ViewChild('unauth', {static: true}) unauth: any;
  title = 'adzapier-analytics-ng';
  faCoffee = faCoffee;
  allPlanData: any;
  hideHeaderFooter = true;
  billingCycle = 'monthly';
  currentPlanData = new DefaultPlanData();
  type = 'cookieConsent';
  msg = '';
  listAddonPlan: any
  public unAuthMsg: any;
  isShowingRouteLoadIndicator: boolean;
  existingOrgPlan = null;
  noPlanType = 'org';

  constructor(private router: Router,
              private modalService: BsModalService,
              private billingService: BillingService,
              private authenticationService: AuthenticationService,
              private ccpaFormConfigurationService: CCPAFormConfigurationService,
              private dsarformService: DsarformService,
              private dataService: DataService,
              private organizationService: OrganizationService
  ) {
    //  this.headerComponent.loadOrganizationList();
    // Lazy Loading indicator
    this.isShowingRouteLoadIndicator = false;
    router.events.subscribe(
      (event: RouterEvent): void => {
        if (event instanceof RouteConfigLoadStart) {
          this.isShowingRouteLoadIndicator = true;
        } else if (event instanceof RouteConfigLoadEnd) {
          this.isShowingRouteLoadIndicator = false;
        }
        // setTimeout( () => {
        //   this.isShowingRouteLoadIndicator = false;
        // }, 25000);

      }
    );
  }

  ngOnInit() {
    this.onGetPlanDetails();
    this.openModal();
    this.openUnAuthModal();
    // this.onGetFeaturesList();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.indexOf('/resetpswd') !== -1 || event.url.indexOf('/verify-email') !== -1) {
          this.hideHeaderFooter = true;
          this.authenticationService.logout();
          this.ccpaFormConfigurationService.removeControls();
          this.dsarformService.removeControls();
          this.organizationService.removeControls();
        }

      }
    });
    feather.replace();
  }

  // onGetFeaturesList(){
  //   this.dataService.getFeaturesList(this.constructor.name, moduleName.appModule)
  //   .subscribe(res => {
  //     // debugger;
  //   })
  // }
  // ngAfterViewInit(){
  //   this.headerComponent.loadOrganizationList();
  // }


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
      this.listAllPlans = this.allPlanData.base[`${this.billingCycle}`];
      this.listAddonPlan = this.allPlanData.addons[`${this.billingCycle}`]
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
      product_name: 'Advanced enterprise features and global coverage. Volume discount available.',
      type: 0
    });

    this.allPlanData.addons['monthly'].push({
      cycle: 'Enterprise',
      description: '',
      id: '',
      name: 'Enterprise',
      price: -1,
      product_name: 'Advanced enterprise features and global coverage. Volume discount available.',
      type: 0
    });
    this.allPlanData.addons['yearly'].push({
      cycle: 'Enterprise',
      description: '',
      id: '',
      name: 'Enterprise',
      price: -1,
      product_name: 'Advanced enterprise features and global coverage. Volume discount available.',
      type: 0
    });
  }
  onSelectBillingCycle(e) {
    if (e.checked) {
      this.billingCycle = 'yearly';
      this.listAllPlans = this.allPlanData.base[`${this.billingCycle}`]
      this.listAddonPlan = this.allPlanData.addons[`${this.billingCycle}`]

    } else {
      this.billingCycle = 'monthly';
      this.listAllPlans = this.allPlanData.base[`${this.billingCycle}`]
      this.listAddonPlan = this.allPlanData.addons[`${this.billingCycle}`]
    }
  }

  onNavigate() {
    this.template.hide();
    this.router.navigateByUrl('/settings/billing/pricing')
  }

  private openUnAuthModal() {
    this.dataService.unAuthPopUp.subscribe((res: any) => {
      if (res.isTrue) {
        this.unAuthMsg = res.error.error;
        this.openUnAuthPopUp()
      }
    })
  }

  openUnAuthPopUp() {
    this.modalRef = this.modalService.show(this.unauth, {class: 'modal-sm'});
  }

  isCurrentPlanActive(): boolean {
    return
  }

}
