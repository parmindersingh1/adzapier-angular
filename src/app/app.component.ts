import { ChangeDetectorRef, Component, OnInit, SimpleChanges, AfterViewChecked, AfterContentChecked, ViewChild, ElementRef, HostListener } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService, OrganizationService, UserService } from './_services';
import { ActivatedRoute, NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterEvent } from '@angular/router';
import * as feather from 'feather-icons';
import { CCPAFormConfigurationService } from './_services/ccpaform-configuration.service';
import { DsarformService } from './_services/dsarform.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DataService } from './_services/data.service';
import { BillingService } from './_services/billing.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { environment } from '../environments/environment';
import { QuickmenuService } from './_services/quickmenu.service';
import { QuickstartmenuComponent } from './_components/quickstartmenu/quickstartmenu.component';
import { Location } from '@angular/common';
import { PricingComponent } from 'src/app/pagesettings/billing/pricing/pricing.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('true', style({
        "max-width": "1040px",
        "margin-left": "10px",
        transform: '  translateX(0)'

      })),
      state('false', style({

        transform: 'translateX(1)'
      })),
      transition('true <=> false', animate('350ms ease-in-out'))
    ])

  ]
  // encapsulation: ViewEncapsulation.None

})
export class AppComponent implements OnInit {
  modalRef: BsModalRef;
  @ViewChild('unauth', { static: true }) unauth: any;
  @ViewChild(QuickstartmenuComponent, { static: true }) quickstartmenuComponent: QuickstartmenuComponent;
  @ViewChild(PricingComponent,{static: false}) pricingComp : PricingComponent;
  @ViewChild('pageContainer', { static: false }) pageContainer: ElementRef;   // for later use
  title = 'adzapier-analytics-ng';
  faCoffee = faCoffee;
  allPlanData: any;
  hideHeaderFooter = true;
  public unAuthMsg: any;
  isShowingRouteLoadIndicator: boolean;
  qcode;
  queryOID;
  queryPID;
  isquickstartopen;
  qsmenulinkobj: any;
  isquickLinkclicked: boolean;
  qsMenuList: any = [];
  isloginpage: boolean;
  toggleQuickstartmenu:boolean;
  quicklinkclickedObj;
  qsmdismissedstatus:boolean;
  //isuserclickonpage:boolean = false; //for later use to check page click event
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    private billingService: BillingService,
    private authenticationService: AuthenticationService,
    private ccpaFormConfigurationService: CCPAFormConfigurationService,
    private dsarformService: DsarformService,
    private dataService: DataService,
    private organizationService: OrganizationService,
    private quickmenuService: QuickmenuService,
    private userService: UserService,
    private location: Location,
    private cdRef: ChangeDetectorRef
  ) {
    if (this.location.path().indexOf('/login') !== -1 || this.location.path().indexOf('signup') !== -1) {
      this.isloginpage = true;
    } else {
      this.isloginpage = false;
    }
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
      }
    );
    this.quickmenuService.isClickedOnQSMenu.subscribe((data) => {
      if (data) {
        this.qsMenuList = this.quickmenuService.getQuerymenulist();
        // console.log(updatedqsMenu,'constructor..appcomp');
        // this.qsMenuList =  [...updatedqsMenu];
      }
    })

  }

  async ngOnInit() {
    // if (this.quickmenuService.getQuickstartDismissStatus() !== null) {
    //   this.toggleQuickstartmenu = this.quickmenuService.getQuickstartDismissStatus().isdismissed;
    // }
    if (this.quickmenuService.getQuickstartDismissStatus() !== null) {
      if(this.quickmenuService.getQuickstartDismissStatus().isdismissed){
        this.toggleQuickstartmenu = this.quickmenuService.getQuickstartDismissStatus().isqstoplink;
      } else if(this.quickmenuService.getQuickstartDismissStatus().isqstoplink){
        this.toggleQuickstartmenu = this.quickmenuService.getQuickstartDismissStatus().isdismissed;
      }else{
        this.toggleQuickstartmenu = false;
      }
    }
    this.quickmenuService.isClickedOnQSMenu.subscribe((data) => {
      if (data) {
        this.qsMenuList = this.quickmenuService.getQuerymenulist();
        // console.log(updatedqsMenu,'constructor..appcomp');
        // this.qsMenuList =  [...updatedqsMenu];
      }
    });
    await this.onInitCPSDK();
    this.openUnAuthModal();
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
    this.activatedRoute.queryParamMap.subscribe(params => {
      // console.log(params.keys,'app..');
      // console.log(params,'params..app 75 component..');
      //if (params.get('code')) {
      //   console.log(params.get('oid'),'app74..');
      this.qcode = params.get('pid');
      this.queryOID = params.get('oid');
      this.queryPID = params.get('pid');
      //  console.log(this.queryOID,'queryOID..');
      //  console.log(this.queryPID,'queryPID..');
      // }
    });
    this.qsMenuList = this.quickmenuService.getQuerymenulist();
    let obj;
    this.quickmenuService.onClickEmitQSLinkobj.subscribe((data) => obj = data);


  }

  async onInitCPSDK() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = environment.consentPreferenceCDN;
      script.type = 'text/javascript';
      // Listen for onload time, after the current js file is loaded, load the next
      script.onload = () => {
        resolve(true);
      };
      document.getElementsByTagName('head')[0].appendChild(script)




      //  const js = document.createElement('script');
      // js.src = environment.consentPreferenceCDN;
      //  js.async = false;
      //  js.defer = false;
      //  js.onload =  () => {
      // resolve(true);
      //  };
      //  js.onerror =  (e) => {
      //   console.error('ConsentPreference Script not loaded due to: ', e);
      //   reject(false);
      // };
    });
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
    this.modalRef = this.modalService.show(this.unauth, { class: 'modal-sm' });
  }

  getStyle($event) {
    if(!$event){
      this.quickmenuService.isquickstartopen = $event;
      this.isquickstartopen = $event;
    }else{
      this.quickmenuService.isquickstartopen = !$event;
      this.isquickstartopen = !$event;
    }
  }

  enableQuickStartMenu($event) {
    if (this.quickmenuService.getQuickstartDismissStatus() !== null) {
      if(this.quickmenuService.getQuickstartDismissStatus().isdismissed){
        this.toggleQuickstartmenu = this.quickmenuService.getQuickstartDismissStatus().isqstoplink;
      } else if(this.quickmenuService.getQuickstartDismissStatus().isqstoplink){
        this.toggleQuickstartmenu = this.quickmenuService.getQuickstartDismissStatus().isdismissed;
      }else{
        this.toggleQuickstartmenu = false;
      }
    }
  }

  receivedQSLinkObj($event) {
    this.quickmenuService.qsMenuobjwithIndexid = $event;
    this.qsmenulinkobj = $event;
    this.qsmenulinkobj.islinkclicked = true;
    if(this.qsmenulinkobj.islinkclicked){
      this.isquickLinkclicked = true;
    }else{
      this.isquickLinkclicked = false;
    }

    // if(Object.values(obj).length !== 0){
    //   this.quickmenuService.updateQuerymenulist(obj);
    // }else{
    this.quickmenuService.updateQuerymenulist($event);
    // }
    //this.quickstartmenuComponent.getupdatedQuickStartMenu();
    this.qsMenuList = this.quickmenuService.getQuerymenulist();

  }

  onNavbarClick($event) {
    console.log($event, '$event...');
  }

  // receivedQSMenuDismissStatus($event){
  //   this.dismissQSMStatus = $event;
  // }

  ngAfterContentChecked() {
  
  }

  ngAfterViewInit() {
    if (this.quickmenuService.getQuickstartDismissStatus() !== null) {
      if(this.quickmenuService.getQuickstartDismissStatus().isdismissed){
        this.qsmdismissedstatus = !this.quickmenuService.getQuickstartDismissStatus().isqstoplink;
      }
    }
    this.isquickstartopen = this.quickmenuService.isquickstartopen;
    this.quickmenuService.onClickEmitQSLinkobj.subscribe((data) => this.quicklinkclickedObj = data);
    this.cdRef.detectChanges();
    let updatedqsMenu = this.quickmenuService.getQuerymenulist();
    this.qsMenuList = [...updatedqsMenu];
    this.cdRef.detectChanges();
  }

  // ngAfterViewChecked(){
  //   this.qsMenuList = this.quickstartmenuComponent.getupdatedQuickStartMenu();
  // }
  ngAfterViewChecked() {
    if (this.quickmenuService.getQuickstartDismissStatus() !== null) {
      if(this.quickmenuService.getQuickstartDismissStatus().isdismissed){
        this.toggleQuickstartmenu = this.quickmenuService.getQuickstartDismissStatus().isqstoplink;
      } else if(!this.quickmenuService.getQuickstartDismissStatus().isqstoplink){
        this.toggleQuickstartmenu = this.quickmenuService.getQuickstartDismissStatus().isdismissed;
      }
    }

    this.isquickstartopen = this.quickmenuService.isquickstartopen;
    if (this.location.path().indexOf('/login') !== -1 || this.location.path().indexOf('signup') !== -1 || this.location.path().indexOf('resetpswd') !== -1) {
      this.isloginpage = false;
    } else {
      this.isloginpage = true;
    }
    this.cdRef.detectChanges();
  }



  ngOnChanges(changes: SimpleChanges) {

    let obj;
    this.quickmenuService.onClickEmitQSLinkobj.subscribe((data) => obj = data);

  }

  onPageClick() {
    if (this.quickmenuService.isclickeventoutsidemenu && this.quicklinkclickedObj !== undefined) {
      this.userService.onRevistQuickStartmenulink.next({ quickstartid: this.quicklinkclickedObj.linkid, reclickqslink: false, urlchanged: true });
    }
  }

}
