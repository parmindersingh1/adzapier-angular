import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { moduleName } from 'src/app/_constant/module-name.constant';
import { QuickStart } from 'src/app/_models/quickstart';
import { BillingService } from 'src/app/_services/billing.service';
import { QuickmenuService } from 'src/app/_services/quickmenu.service';
import {AuthenticationService, UserService} from '../../../_services';
const moment = require('moment');

@Component({
  selector: 'app-manage-subscription',
  templateUrl: './manage-licence.component.html',
  styleUrls: ['./manage-licence.component.scss']
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
  isquickstartdivclicked:any;
  quickDivID;
  isRevistedLink:boolean;
  currentLinkID:any;
  actuallinkstatus:boolean = false;
  isquickstartmenu:any;
  constructor(
    private loading: NgxUiLoaderService,
    private billingService: BillingService,
    private quickmenuService: QuickmenuService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.quickmenuService.onClickEmitQSLinkobj.pipe(
      takeUntil(this.unsubscribeAfterUserAction$)
    ).subscribe((res) => { 
      this.quickDivID = res.linkid;
    });
    console.log(this.quickDivID,'quickDivID51');
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
         console.log('user role', this.userRole);
       }
    });


    this.onGetActivePlan();
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

  userAction(planid,quickdivid) {
    let quickLinkObj: QuickStart = {
      linkid: quickdivid,
      indexid: quickdivid === 19 ? 5 : 3,
      isactualbtnclicked: true,
      islinkclicked: true,
      divguidetext: "addcookieconsentsubscriptiontoproperty",
      linkdisplaytext: "Assigning Cookie Consent subscription to property",
      link: "/settings/billing/manage"
    };
    this.quickmenuService.onClickEmitQSLinkobj.next(quickLinkObj);
    this.quickmenuService.updateQuerymenulist(quickLinkObj);
    const a = this.quickmenuService.getQuerymenulist();
    this.quickmenuService.onClickEmitQSLinkobj.pipe(
      takeUntil(this.unsubscribeAfterUserAction$)
    ).subscribe((res) => {
    if(a.length !== 0){
      const idx = a.findIndex((t)=>t.index == quickLinkObj.indexid);
      if (a[idx].quicklinks.some((t) => t.linkid == res.linkid && t.isactualbtnclicked)) {
        this.quickDivID = "";
        this.router.navigate(['/settings/billing/manage/property', planid], { queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling: 'merge', skipLocationChange: false });
      } else if(a[idx].quicklinks.some((t) => t.linkid == res.linkid && !t.isactualbtnclicked)) {
        this.quickDivID = res.linkid;
      }
    }
  });
    
  }

  userActionForOrg(planid) {
    let quickLinkObj: QuickStart = {
      linkid: 12,
      indexid: 4,
      isactualbtnclicked: true,
      islinkclicked: true,
      divguidetext: "assign-dsar-subscription-to-organization",
      linkdisplaytext: "Add DSAR subscription",
      link: "/settings/billing/manage"
    };
    this.quickmenuService.updateQuerymenulist(quickLinkObj);
    this.quickmenuService.onClickEmitQSLinkobj.next(quickLinkObj);
    const a = this.quickmenuService.getQuerymenulist();
    this.quickmenuService.onClickEmitQSLinkobj.pipe(
      takeUntil(this.unsubscribeAfterUserAction$)
    ).subscribe((res) => {
    if(a.length !== 0){
      const idx = a.findIndex((t)=>t.index == quickLinkObj.indexid);
      
      if (a[idx].quicklinks.some((t) => t.linkid == quickLinkObj.linkid && t.isactualbtnclicked)) {
        this.quickDivID = "";
        this.router.navigate(['/settings/billing/manage/organizations', planid], { queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling: 'merge', skipLocationChange: false });
      } else if(a[idx].quicklinks.some((t) => t.linkid == quickLinkObj.linkid && !t.isactualbtnclicked)) {
        this.quickDivID = quickLinkObj.linkid;
      }
    }
  });
   
  }
  
}
