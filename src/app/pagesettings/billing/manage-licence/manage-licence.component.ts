import {Component, ChangeDetectorRef, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {moduleName} from 'src/app/_constant/module-name.constant';
import {BillingService} from 'src/app/_services/billing.service';
import {OrganizationService, UserService} from '../../../_services';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {DataService} from '../../../_services/data.service';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { QuickmenuService } from 'src/app/_services/quickmenu.service';
import { QuickStart } from 'src/app/_models/quickstart';

@Component({
  selector: 'app-manage-subscription',
  templateUrl: './manage-licence.component.html',
  styleUrls: ['./manage-licence.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageLicenceComponent implements OnInit {
  private unsubscribeAfterUserAction$: Subject<any> = new Subject<any>();
  activeSubscriptionList = [];
  alertMsg: any;
  isOpen = false;
  skLoading = false;
  alertType: any;
  isSuccess: boolean;
  isError: boolean;
  showManageText = false;
  inActiveplans = [];
  userRole: any;
  queryOID;
  queryPID;
  propertyForm: FormGroup;
  modalRef: BsModalRef;
   submitted: boolean = false;
  private currentManagedOrgID: any;
  private currrentManagedPropID: any;
  assigneLicence = 0;
  propertyList = [];
  planID = '';
  oID = '';
  private planType = '';
  allUnSignPropertyList = [];
  orgList = [];
  totalLicence = 0;
  propertyNameError = false;
  orgForm: FormGroup;
  allUnSignOrgList = [];
  totalLicenceOrg = 0;
  assigneLicenceOrg = 0;
  orgNameError = null;
  isquickstartdivclicked:any;
  quickDivID;
  isRevistedLink:boolean;
  currentLinkID:any;
  actuallinkstatus:boolean = false;
  isquickstartmenu:any;
  actualbtnClickstatus:boolean = false;
  iswindowclicked;
  constructor(
    private loading: NgxUiLoaderService,
    private billingService: BillingService,
    private quickmenuService: QuickmenuService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private dataService: DataService,
    private orgservice: OrganizationService,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.quickmenuService.onClickEmitQSLinkobj.pipe(
      takeUntil(this.unsubscribeAfterUserAction$)
    ).subscribe((res) => { 
      this.quickDivID = res.linkid;
      this.actualbtnClickstatus = res.isactualbtnclicked;
    });
    this.activatedRoute.queryParamMap
      .subscribe(params => {
      this.queryOID = params.get('oid');
      this.queryPID = params.get('pid');
    });
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.success === 'true') {
        this.isSuccess = true;
      } else if (params.success === 'false') {
        this.isError = true;
      }
      if (params.hasOwnProperty('type')) {
        this.showManageText = true;
      }
    });

    this.userService.getLoggedInUserDetails(this.constructor.name, moduleName.manageSubscriptionsModule).subscribe((res: any) => {
       if (res.status === 200) {
         this.userRole = res.response.role;
       }
    });


    this.onGetActivePlan();
    this.propertyForm = this.formBuilder.group({
      propID: ['', Validators.required]
    });
    this.orgForm = this.formBuilder.group({
      orgID: ['', Validators.required]
    });
    this.onGetPropsAndOrgId();
    this.getAllOrgList();
    this.getAllOrgList2();
  }

  onGetPropsAndOrgId() {
    this.orgservice.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.currentManagedOrgID = response.organization_id || response.response.oid;
        this.currrentManagedPropID = response.property_id || response.response.id;
      } else {
        this.currentManagedOrgID = this.queryOID;
        this.currrentManagedPropID = this.queryPID;
      }
    });
  }

  onGetActivePlan() {
      this.loading.start();
      this.skLoading = true;
      this.billingService.getActivePlan(this.constructor.name, moduleName.manageSubscriptionsModule).subscribe( (res: any) => {
        this.loading.stop();
        this.skLoading = false;
        this.activeSubscriptionList = res.response;
        this.inActiveplans = [];
        for (const isActive of res.response) {
          if (!isActive.active) {
            this.inActiveplans.push(isActive);
          }
        }
      }, err => {
        this.loading.stop();
        this.skLoading = false;
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      });
  }

  onGenerateSessionID() {
    this.loading.start();
    this.billingService.getManageSessionID(this.constructor.name, moduleName.manageSubscriptionsModule).subscribe( (res: any) => {
      this.loading.stop();
      if (res.status === 200) {
        window.open(res.response, '_blank');
      }

    }, err => {
      this.loading.stop();
      this.isOpen = true;
      this.alertMsg = err;
      this.alertType = 'danger';
    });
}

  onCalculateOptValue(val, totalConsent) {
    const cal = Math.ceil(val * 100 / totalConsent);
    if (isNaN(cal)) {
      return 0;
    } else {
      return cal;
    }
  }

  // add  Properties
  openModal(template: TemplateRef<any>, plan) {
    this.assigneLicence = plan.assigned_licence;
    this.totalLicence = plan.total_licence;
    this.planID = plan.id;
    this.planType = plan.planDetails.type;
    this.modalRef = this.modalService.show(template);
  }
  async onSubmit() {
    this.submitted = true;
    this.propertyNameError = this.propertyForm.value.propID.length > this.totalLicence - this.assigneLicence ? true : false;
    // stop here if form is invalid
    if (this.propertyForm.invalid) {
      return;
    }
    const payload = {
      planID: this.planID,
      propID: this.propertyForm.value.propID,
      orgID: this.oID,
      planType: String(this.planType)
    };
    this.loading.start();

    this.skLoading = true;
    this.billingService.assignPropertyLicence(this.constructor.name, moduleName.billingModule, payload)
      .subscribe((res: any) => {
        this.loading.stop();
        this.skLoading = false;
        this.modalRef.hide();
        this.isOpen = true;
        this.alertMsg = res.response;
        this.alertType = 'success';
        this.propertyForm.reset();
        this.onGetAssingedProperty();
        this.dataService.isLicenseAppliedForProperty.next({ requesttype: 'property', hasaccess: true });
        this.isCurrentPropertySelected(this.currentManagedOrgID, this.currrentManagedPropID);

      }, err => {
        this.loading.stop();
        this.skLoading = false;
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      });
    // display form values on success
  }
  async isCurrentPropertySelected(orgID, propID) {
    this.loading.start('2');
    this.dataService.getOrgPlanInfo(this.constructor.name, moduleName.cookieConsentModule, orgID)
      .subscribe((res: any) => {
        this.loading.stop('2');
        this.dataService.setOrgPlanToLocalStorage(res);
      }, error => {
        this.loading.stop('2');
      });
    this.loading.start('1');
    this.dataService.getPropertyPlanDetails(this.constructor.name, moduleName.cookieConsentModule, propID)
      .subscribe((res: any) => {
        this.dataService.removePropertyPlanFromLocalStorage();
        this.dataService.setPropertyPlanToLocalStorage(res);
        this.loading.stop('1');
      }, err => {
        this.loading.stop('1');
      });
  }

  onGetAssingedProperty() {
    this.loading.start();
    this.skLoading = true;
    this.billingService.getAssignedPropByPlanID(this.constructor.name, moduleName.billingModule, this.planID).subscribe((res: any) => {
      this.loading.stop();
      this.skLoading = false;
      this.assigneLicence = res.response.length;
      this.propertyList = res.response;
    }, err => {
      this.loading.stop();
      this.skLoading = false;
      this.isOpen = true;
      this.alertMsg = err;
      this.alertType = 'danger';
    });
  }

  onGetAllPropertyList(e) {
    this.oID = e.target.value;
    const payload = {oID: e.target.value, planID: this.planID, planType: String(this.planType)};
    this.loading.start('2');
    this.billingService.getAllPropertyList(this.constructor.name, moduleName.billingModule, payload)
      .subscribe((res: any) => {
        this.loading.stop('2');
        this.onGetAllPropertyLicenseList(e, res);
      }, err => {
        this.loading.stop('2');
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      });
  }

  onGetAllPropertyLicenseList(e, res) {
    const payload = {oID: e.target.value, licenseType: String(this.planType)};
    this.loading.start('3');
    this.billingService.getAllPropertyLicenseList(this.constructor.name, moduleName.billingModule, payload)
      .subscribe((result: any) => {
        this.loading.stop('3');

        const propertyList = [...res.response];
        const assignedLicenseProperty = [];

        for (const assignedProperty of result.response) {
          assignedLicenseProperty.push(assignedProperty.pid);
        }

        this.allUnSignPropertyList = [];
        for (const propertyObj of propertyList) {
          if (!assignedLicenseProperty.includes(propertyObj.id)) {
            this.allUnSignPropertyList.push({label: propertyObj.name, value: propertyObj.id});
          }
        }
        this.search;
      }, err => {
        this.loading.stop('3');
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      });
  }
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 0 ? []
        : this.allUnSignPropertyList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
  getAllOrgList() {
    this.loading.start('3');
    this.billingService.getAllActiveOrgList(this.constructor.name, moduleName.billingModule)
      .subscribe((res: any) => {
        this.loading.stop('3');
        this.orgList = res.response;
      }, err => {
        this.loading.stop('3');
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      });
  }
  get f() {
    return this.propertyForm.controls;
  }
  // add Organization
  openModalOrg(template: TemplateRef<any>, plan) {
    this.assigneLicenceOrg = plan.assigned_licence;
    this.totalLicenceOrg = plan.total_licence;
    this.planID = plan.id;
    this.planType = plan.planDetails.type;
    this.modalRef = this.modalService.show(template);
  }

  onSubmitOrg() {
    this.submitted = true;
    this.orgNameError = !this.orgForm.value.orgID ? true : false;
    // stop here if form is invalid
    if (this.orgForm.invalid) {
      return;
    }
    const payload = {
      planID: this.planID,
      orgID: this.orgForm.value.orgID
    };
    this.loading.start();
    this.skLoading = true;
    this.billingService.assignOrgLicence(this.constructor.name, moduleName.billingModule, payload)
      .subscribe(res => {
        this.loading.stop();
        this.skLoading = false;
        this.modalRef.hide();
        // this.licenseAvailabilityForFormAndRequestPerOrg(this.orgForm.value.orgID);
        this.orgForm.reset();
        // this.onGetAssingedOrg()
        this.getAllOrgList2();
        this.isCurrentPropertySelected(this.currentManagedOrgID, this.currrentManagedPropID)
        this.dataService.isLicenseApplied.next({ requesttype: 'organization', hasaccess: true });
      }, err => {
        this.loading.stop();
        this.skLoading = false;
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      });
    // display form values on success
  }
  searchOrg = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 0 ? []
        : this.allUnSignOrgList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
  getAllOrgList2() {
    this.loading.start('3');
    this.billingService.getAllOrgList(this.constructor.name, moduleName.billingModule)
      .subscribe((res: any) => {
        this.loading.stop('3');
        // this.orgList = res.response;

        this.allUnSignOrgList = [];
        for (const orgObj of res.response) {
          this.allUnSignOrgList.push({label: orgObj.orgname, value: orgObj.id})
        }
        this.searchOrg
      }, err => {
        this.loading.stop('3');
        this.isOpen = true;
        this.alertMsg = err;
        this.alertType = 'danger';
      })
  }
  userAction(planid, quickdivid) {
    if (quickdivid !== undefined && (quickdivid == 6 || quickdivid == 19)) {
      let quickLinkObj: QuickStart = {
        linkid: quickdivid,
        indexid: quickdivid === 19 ? 5 : 3,
        isactualbtnclicked: true,
        islinkclicked: true,
        divguidetext: "addcookieconsentsubscriptiontoproperty",
        linkdisplaytext: "Assigning Cookie Consent subscription to property",
        link: "/settings/billing/manage"
      };
      this.quickmenuService.updateQuerymenulist(quickLinkObj);
      this.quickmenuService.onClickEmitQSLinkobj.next(quickLinkObj);
      this.userService.onRevistQuickStartmenulink.next({quickstartid:this.quickDivID,reclickqslink:true,urlchanged:false});
      const a = this.quickmenuService.getQuerymenulist();
        if (a.length !== 0) {
          const idx = a.findIndex((t) => t.index == quickLinkObj.indexid);
          if (a[idx].quicklinks.some((t) => t.linkid == quickLinkObj.linkid && t.isactualbtnclicked)) {
            this.quickDivID = "";
            this.router.navigate(['/settings/billing/manage/property', planid], { queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling: 'merge', skipLocationChange: false });
          } else if (a[idx].quicklinks.some((t) => t.linkid == quickLinkObj.linkid && !t.isactualbtnclicked)) {
            this.quickDivID = "";
            this.router.navigate(['/settings/billing/manage/property', planid], { queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling: 'merge', skipLocationChange: false });
          }
        }
    } else {
      this.checkForQsTooltip();
      this.router.navigate(['/settings/billing/manage/property', planid], { queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling: 'merge', skipLocationChange: false });
    }

  }

  userActionForOrg(planid, quickdivid) {
    if (quickdivid !== undefined && quickdivid == 12) {
      let quickLinkObj: QuickStart = {
        linkid: quickdivid,
        indexid: 4,
        isactualbtnclicked: true,
        islinkclicked: true,
        divguidetext: "assign-dsar-subscription-to-organization",
        linkdisplaytext: "Add DSAR subscription",
        link: "/settings/billing/manage"
      };
      this.quickmenuService.updateQuerymenulist(quickLinkObj);
      this.quickmenuService.onClickEmitQSLinkobj.next(quickLinkObj);
      this.userService.onRevistQuickStartmenulink.next({quickstartid:this.quickDivID,reclickqslink:true,urlchanged:false});
      this.quickDivID = "";
      const a = this.quickmenuService.getQuerymenulist();
        if (a.length !== 0) {
          const idx = a.findIndex((t) => t.index == quickLinkObj.indexid);

          if (a[idx].quicklinks.some((t) => t.linkid == quickLinkObj.linkid && t.isactualbtnclicked)) {
            this.quickDivID = "";
            
            this.router.navigate(['/settings/billing/manage/organizations', planid], { queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling: 'merge', skipLocationChange: false });
          } else if (a[idx].quicklinks.some((t) => t.linkid == quickLinkObj.linkid && !t.isactualbtnclicked)) {
            this.quickDivID = "";
          }
        }
    } else {
      this.checkForQsTooltip();
      this.router.navigate(['/settings/billing/manage/organizations', planid], { queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling: 'merge', skipLocationChange: false });
    }

  }

  checkForQsTooltip(){
    this.userService.onRevistQuickStartmenulink.next({quickstartid:this.quickDivID,reclickqslink:true,urlchanged:true}); 
    this.quickDivID = "";    
  }
   

  ngAfterViewInit(){
    this.userService.isRevisitedQSMenuLink.subscribe((status) => { this.isRevistedLink = status.reclickqslink; this.currentLinkID = status.quickstartid; this.iswindowclicked = status.urlchanged  });
    this.quickmenuService.onClickEmitQSLinkobj.pipe(
      takeUntil(this.unsubscribeAfterUserAction$)
    ).subscribe((res) => { 
      this.quickDivID = res.linkid;
    });
    this.cdRef.detectChanges();
  }

  ngOnDestroy(){
    this.quickDivID = "";
    this.unsubscribeAfterUserAction$.unsubscribe();
  }
  
}
