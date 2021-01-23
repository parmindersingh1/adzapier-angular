import { Component, OnInit } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService, OrganizationService } from './_services';
import { User } from './_models';
import { HeaderComponent } from './_components/layout/header/header.component';
import { Router, NavigationEnd } from '@angular/router';
import * as feather from 'feather-icons';
import { CCPAFormConfigurationService } from './_services/ccpaform-configuration.service';
import { DsarformService } from './_services/dsarform.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ViewChild } from '@angular/core';
import { DataService } from './_services/data.service';
import { moduleName } from './_constant/module-name.constant';
import { TemplateRef } from '@angular/core';
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
  @ViewChild('template', { static: true}) template: any;
  title = 'adzapier-analytics-ng';
  faCoffee = faCoffee;
  allPlanData: any;
  hideHeaderFooter = true;
  billingCycle = 'monthly';
  currentPlanData = new DefaultPlanData();
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
  }

  ngOnInit() {
    this.onGetPlanDetails();
    this.openModal();
    this.onGetFeaturesList();
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

  onGetFeaturesList(){
    this.dataService.getFeaturesList(this.constructor.name, moduleName.appModule)
    .subscribe(res => {
      // debugger;
    })
  }
  // ngAfterViewInit(){
  //   this.headerComponent.loadOrganizationList();
  // }



  openModal() {
    this.dataService.openModalWithData.subscribe( res => {
      if(res.openModal) {
        // debugger
        if(res.data !== null) {
          this.currentPlanData = res.data
        } else {
            this.currentPlanData = new DefaultPlanData();
        }
        this.template.show();
      }
    })
  }

  onGetPlanDetails() {
    this.billingService.getCurrentPlanInfo(this.constructor.name, moduleName.pricingModule).subscribe((res: any) => {
      this.allPlanData = res.response.base;
      this.listAllPlans = res.response.base[`${this.billingCycle}`];
      // this.subscriptionList = res.response.monthly;
    }, error => {
    });
  }
  onSelectBillingCycle(e) {
    if (e.checked) {
      this.billingCycle = 'yearly';
      this.listAllPlans = this.allPlanData[`${this.billingCycle}`]
    } else {
      this.billingCycle = 'monthly';
      this.listAllPlans = this.allPlanData[`${this.billingCycle}`]
    }
  }

  onNavigate() {
    this.template.hide();
    this.router.navigateByUrl('/settings/billing/pricing')
  }
}
