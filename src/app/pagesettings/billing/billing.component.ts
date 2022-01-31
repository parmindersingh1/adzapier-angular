import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingService } from 'src/app/_services/billing.service';
import { CompanyService } from 'src/app/company.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {moduleName} from '../../_constant/module-name.constant';
import { Title } from '@angular/platform-browser';



@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  isSuccess = false;
  isError = false;
  @ViewChild('showAlertMsg') showAlertMsg;
  modalRef: BsModalRef;
  confirmModal: BsModalRef;
  billingDetails: any = {
    billing_details: {},
    billing_history: {},
    company_details: {}
  };
  companyDetails: any = [];
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private billingService: BillingService,
              private companyService: CompanyService,
              private loading: NgxUiLoaderService,
              private modalService: BsModalService,
              private titleService: Title 

  ) {
    this.titleService.setTitle("Billing");


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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm', animated: false,    keyboard: false,     ignoreBackdropClick: true
    });
  }

  onGetCurrentPlan() {
    this.loading.start();
    this.billingService.getCurrentPlan(this.constructor.name, moduleName.billingModule).subscribe((res: any) => {
      this.loading.stop();
      if (res.status === 200) {
        if (typeof (res.response) === 'string') {
          this.openModal(this.showAlertMsg);
          this.isOpen = true;
          this.alertMsg = 'You have not Subscribed with any plan...';
          this.alertType = 'info';
        } else if (Object.keys(res.response).length === 0) {
          this.openModal(this.showAlertMsg);
        } else {
          if (Object.keys(res.response).length > 0) {
            this.billingDetails = res.response;
          }
        }
      }
    }, error => {
      this.loading.stop();
      this.isOpen = true;
      this.alertMsg = error;
      this.alertType = 'danger';
    });
    setTimeout(() => {
      this.loading.stop();
    }, 4000);
  }

  navigateToPricing() {
    this.modalRef.hide();
    this.router.navigateByUrl('/settings/billing/pricing');
  }

  onGetCompanyDetails() {
    this.companyService.getCompanyDetails(this.constructor.name, moduleName.billingModule).subscribe(res => {
      if (res['status'] === 200) {
        this.companyDetails.push(res['response']);
      }
    }, error => {
      this.isOpen = true;
      this.alertMsg = error;
      this.alertType = 'danger';
    });
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  onCancelPlan() {
    this.loading.start();
    this.billingService.cancelPlan(this.constructor.name, moduleName.billingModule)
      .subscribe( (res: any) => {
        this.loading.stop();
        if (res) {
          this.isOpen = true;
          this.alertMsg = res.response;
          this.alertType = 'info';
        }
      }, error => {
        this.loading.stop();
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
      });
  }

  openConfimModal(template: TemplateRef<any>) {
    this.confirmModal = this.modalService.show(template, {class: 'modal-sm',  animated: false,    keyboard: false,     ignoreBackdropClick: true});
  }

  confirm(): void {
    this.onCancelPlan();
    this.confirmModal.hide();
  }

  decline(): void {
    this.confirmModal.hide();
  }
}
