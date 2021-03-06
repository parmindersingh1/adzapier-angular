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
    trigger('slideInOutApp', [
      state('true', style({
       "margin-left":"200px",
        transform: '  translateX(0)'

      })),
      state('false', style({

        transform: 'translateX(1)'
      })),
      transition('true <=> false', animate('200ms linear'))
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
  hideHeaderFooter:boolean = true;
  public unAuthMsg: any;
  isShowingRouteLoadIndicator: boolean;
  qcode;
  queryOID;
  queryPID;
  isquickstartopen;
  qsmenulinkobj: any;
  isquickLinkclicked: boolean;
  qsMenuList: any = [];
  isloginpage: boolean = true;
  isQuickstartmenuDismissed:boolean = false;
  quicklinkclickedObj;
  qsmdismissedstatus:boolean;
  isBillingpageUrl:boolean = false;
  //isuserclickonpage:boolean = false; //for later use to check page click event
  isSidemenuOnHover:boolean = false;
  isSidemenuMouseOut:boolean = false;
  isSidemenuClick:boolean = false;
  checkSidemenuVisibility:boolean = false;
  checkQSMStatus$ = this.quickmenuService.isClickedOnQSMenu;
  isqsmheadingClicked:boolean = false;
  isquickstartClosedbtnClicked:boolean = false;
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
    if (this.location.path().indexOf('/login') !== -1 || this.location.path().indexOf('signup') !== -1 || this.location.path().indexOf('invited-user-verify-email') !== -1) {
        this.isloginpage = false;
    } else {
      this.isloginpage = true;
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
  }

  async ngOnInit() {
    if (this.location.path().indexOf('/resetpswd') !== -1){
      this.hideHeaderFooter = false;
      this.authenticationService.logout();
      localStorage.removeItem('currentUser');
      this.userService.getCurrentUser.unsubscribe();
      localStorage.clear();
      this.ccpaFormConfigurationService.removeControls();
      this.dsarformService.removeControls();
      this.organizationService.removeControls();
      this.router.navigateByUrl(this.location.path());
      return false;
    }
    await this.onInitCPSDK();
    this.openUnAuthModal();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.indexOf('welcome') !== -1) {
          this.hideHeaderFooter = true;
        }
        if (event.url.indexOf('/resetpswd') !== -1 || event.url.indexOf('/verify-email') !== -1 || event.url.indexOf('invited-user-verify-email') !== -1 || event.url.indexOf('/setpassword') !== -1) {
          this.hideHeaderFooter = false;
          this.authenticationService.logout();
          localStorage.removeItem('currentUser');
          this.userService.getCurrentUser.unsubscribe();
          localStorage.clear();
          this.ccpaFormConfigurationService.removeControls();
          this.dsarformService.removeControls();
          this.organizationService.removeControls();
        }
        if(event.url.indexOf('/settings/billing/pricing') !== -1 || event.url.indexOf('/settings/billing/cart') !== -1 || event.url.indexOf('/settings/billing/cartreview') !== -1){
          this.isBillingpageUrl = true;
        }else{
          this.isBillingpageUrl = false;
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
    this.isquickstartopen = $event;
  }

  onCloseQuickStart($event){
    this.isquickstartClosedbtnClicked = $event;
  }

  onDismissQSM($event){
    this.isQuickstartmenuDismissed = $event;
  }

  enableQuickStartMenu($event) {
    this.isQuickstartmenuDismissed = $event;
  }

  receivedQSLinkObj($event) {
    this.quickmenuService.qsMenuobjwithIndexid = $event;
    this.qsmenulinkobj = $event;
    this.qsmenulinkobj.islinkclicked = true;
    this.isquickLinkclicked = true;
  }

  onClickQSMHeading($event){
    this.isqsmheadingClicked = $event;
    this.userService.onRevistQuickStartmenulink.next({quickstartid:0,reclickqslink:true,urlchanged:true}); 
  }

  onNavbarClick($event) {
    console.log($event, '$event...');
  }

  // receivedQSMenuDismissStatus($event){
  //   this.dismissQSMStatus = $event;
  // }

  ngAfterContentChecked() {
    this.isSidemenuClick = this.userService.isSideMenuClicked;
    this.checkSidemenuVisibility = this.userService.isSideMenuVisible;
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
  }

  // ngAfterViewChecked(){
  //   this.qsMenuList = this.quickstartmenuComponent.getupdatedQuickStartMenu();
  // }
  ngAfterViewChecked() {
    if (this.location.path().indexOf('welcome') !== -1) {
      this.hideHeaderFooter = true;
    } //after reset password when user login this block required.
    this.isquickstartopen = this.quickmenuService.isquickstartopen;
    if (this.location.path().indexOf('/login') !== -1 || this.location.path().indexOf('signup') !== -1 || this.location.path().indexOf('resetpswd') !== -1 || this.location.path().indexOf('invited-user-verify-email') !== -1 || this.location.path().indexOf('setpassword') !== -1) {
      this.isloginpage = false; // quick start will not be visible
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
