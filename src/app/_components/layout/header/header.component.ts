import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { OrganizationService, AuthenticationService, UserService } from '../../../_services';
import { Observable } from 'rxjs';
import { Organization } from 'src/app/_models/organization';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { moduleName } from 'src/app/_constant/module-name.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Location } from '@angular/common';
import { DataService } from 'src/app/_services/data.service';
import { featuresName } from '../../../_constant/features-name.constant';
import { debounceTime, filter } from 'rxjs/operators';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('confirmTemplate') confirmModal: TemplateRef<any>;
  modalRef: BsModalRef;
  isCollapsed = true;
  isMobileMenuCollapsed = false;
  isMobilePropertyCollapsed = true;
  isMobileDashboardMenuCollapsed = true;
  isMobilePrivacyMenuCollapsed = true;
  accessHeader: boolean;
  public currentLoggedInUser: string;
  uid: string;
  userData: any;
  returnUrl: string;
  currentUser: any;
  token: any;
  loginToken: any;
  public isHeaderVisible: boolean;
  public headerStatus: boolean;
  orgList: any;
  currentOrganization: any;
  navigationMenu: any;
  rightItems: any;
  leftItems: any;
  selectedOrgProperties: any = [];
  organizationList$: Observable<Organization[]>;
  firstElement: boolean;
  activeProp: any;
  publicNavigationMenu: any;
  currentProperty: any;
  navToggleStatus = false;
  close: boolean = true;
  userRole: string;
  propertyList: any;
  listOfProp: any;
  orgId: any;
  orgPropertyMenu: any;
  userID: any;
  propList: any;
  isOrganizationUpdated: boolean;
  isPropertyUpdated: boolean;
  isPropertySelected: boolean;
  isPrivacyActivelinkMatched = false;
  isBillingActivelinkMatched = false;
  isConsentPreferencelinkMatched = false;
  isOtherActivelinkMatched = false;
  isSublinkActive = false;
  selectedSubmenu: any = [];
  notificationList: any = [];
  storeNotificationList: any = [];
  notificationsNumber: number;
  isNotificationBellClicked = false;
  resCID: any;
  resuserCID: any;
  navbarOpen = false;
  addMobileMenuWidth: any;
  addMobileBackdrop: any;
  isShowDashboardForCookieConsent = false;
  isShowDashboardForDsar = false;
  planDetails: any;
  isNewnotification: boolean;
  showConsentPreference = false;
  currentNavigationUrl : string;
  updatedUrlWithPID;
  updatedUrlWithOID;
  isCurrentSelectedProperty;
  isUrlWithPropID:boolean = false;
  oIDPIDFromURL:any = [];
  queryOID;
  queryPID;
  initialPropertyID;
  initialOrgID;
  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private orgservice: OrganizationService,
    private authService: AuthenticationService,
    private userService: UserService,
    private loading: NgxUiLoaderService,
    private bsmodalService: BsModalService,
    private dataService: DataService,
    private location: Location,
    private cdRef: ChangeDetectorRef
  ) {
   
    this.authService.currentUser.subscribe(x => {
      this.currentUser = x;
      if (this.currentUser) {
        this.isCollapsed = false;
        this.getLoggedInUserDetails();
        this.loadOrganizationList();
        this.loadOrganizationWithProperty();  //to load org and prop
        this.loadNotification();
      }
    });

    this.orgservice.isOrganizationUpdated.subscribe((t) => {
      this.isOrganizationUpdated = t;
      if (this.isOrganizationUpdated) {
        this.loadOrganizationWithProperty(); //to load org and prop
        // if(this.oIDPIDFromURL !== undefined){
        // this.currentSelectedProperty();
        // }
        this.loadNotification();
      }
    });
   

    // this.router.routeReuseStrategy.shouldReuseRoute = () => {
    //   return false;
    // };
    this.activatedroute.queryParamMap
    .subscribe(params => {
      this.queryOID = params.get('oid');
      this.queryPID = params.get('pid');
     });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
      }
      if (event instanceof NavigationEnd) {
        this.isPrivacyActivelinkMatched = event.url.indexOf('privacy') >= 0 || event.url.indexOf('home') >= 0
          || event.url.indexOf('cookie') >= 0;
      } else if (event instanceof NavigationEnd) {
        if (event.url.indexOf('settings/billing') !== -1 || event.url.indexOf('pricing') !== -1 ||
          event.url.indexOf('welcome') >= 0) {
          this.isBillingActivelinkMatched = true;
          this.isPrivacyActivelinkMatched = false;
        }
      } else if (event instanceof NavigationEnd) {
          this.isBillingActivelinkMatched = false;
          this.isPrivacyActivelinkMatched = false;
          this.isConsentPreferencelinkMatched = event.url.indexOf('consent-preference') !== -1;
      }
    });
    this.authService.isNotificationUpdated.subscribe((status) => {
      this.isNewnotification = status;
      if (this.isNewnotification) {
        this.loadNotification();
      }
    });
  }

  ngOnInit() {
 //   this.loadOrganizationWithProperty();
 //this.router.routeReuseStrategy.shouldReuseRoute = () => false;
 this.activatedroute.queryParamMap
 .subscribe(params => {
   this.queryOID = params.get('oid');
   this.queryPID = params.get('pid');
   //console.log(this.queryOID,'queryOID210..');
   //console.log(this.queryPID,'queryPID211..');
  });
    this.isCollapsed = false;
    this.userService.getCurrentUser.subscribe((data) => {
      if (data) {
        this.currentUser = data;
        this.isCollapsed = false;
        this.currentLoggedInUser = this.currentUser.response.firstname + ' ' + this.currentUser.response.lastname;
        this.userRole = this.currentUser.response.role;
        this.userID = this.currentUser.response.uid;
        this.checkCurrentManagingProperty();
        this.loadOrganizationWithProperty(); //to load org and prop
        this.loadNotification();
      }
    }, (error) => {
      console.log(error);
    });
    this.orgservice.emitUpdatedOrgList.subscribe((data) => {
      this.loadOrganizationList();
    });
    this.publicNavigationMenu = [
      {
        showlink: 'Solutions',
        subcategory: [{ showlink: 'DSAR', routerLink: '/dsar' }, { showlink: 'GDPR', routerLink: '/gdpr' }]
      }, {
        showlink: 'Pricing', routerLink: '/plans'
      }, {
        showlink: 'Partners', routerLink: '/partners'
      }, {
        showlink: 'Contact Us', routerLink: '/contactus'
      }];
    // this.onCheckSubscriptionForProperty();
    // this.onCheckSubscriptionForOrg();
    // this.onCheckConsentPreferenceSubscription();
    window.addEventListener('storage', event => {
      if (event.storageArea == localStorage) {
        let token = localStorage.getItem('currentUser');
        if (token == undefined) {
          this.authService.logout();

          this.isCollapsed = true;
          localStorage.removeItem('currentUser');
          // this.orgservice.removeControls();
          this.userService.getCurrentUser.unsubscribe();
          localStorage.clear();
          this.selectedOrgProperties.length = 0;
          if (this.location.path().indexOf('/signup') !== -1 || this.location.path().indexOf('/verify-email') !== -1) {
            const a = this.location.path().split("?id=");
            this.router.navigate([a[0]],{ queryParams: { id: a[1] }});
            sessionStorage.clear();
            this.router.navigate(["/signup"], { queryParams: { id: a[1] } });
          } else{
            this.router.navigate(['/login']);
          }
        }
      }
    });
    this.onCheckConsentPreferenceSubscription();
    
    this.oIDPIDFromURL= this.findPropertyIDFromUrl(this.location.path());
    if(this.oIDPIDFromURL !== undefined){
     this.checkCurrentManagingProperty();
    }
    
    this.getPropertyDetailsFromUrl();
  }


  onCheckConsentPreferenceSubscription() {
    this.planDetails = this.dataService.getCurrentPropertyPlanDetails();
    if (this.planDetails !== "") {
      const isAllowConsentPreference = this.dataService.isAllowFeatureByYes(this.planDetails.response, featuresName.CONSENT_PREFERENCE);
      this.dataService.isConsentPreferenceApplied.next({ requesttype: 'consentpreference', hasaccess: isAllowConsentPreference });
      this.showConsentPreference = isAllowConsentPreference;
    }
  }


  logout() {
    this.authService.logout();

    this.isCollapsed = true;
    localStorage.removeItem('currentUser');
    // this.orgservice.removeControls();
    this.userService.getCurrentUser.unsubscribe();
    localStorage.clear();
    this.router.navigate(['/login']);
    sessionStorage.clear();
    location.reload();


  }

  editProfile() {
    return this.router.navigate(['userprofile']);
  }

  isHeaderVisibleTop(): boolean {
    this.userService.currentregSubject.subscribe((data) => {
      if (data) {
        this.headerStatus = true;
      } else {
        this.headerStatus = false;
      }
    });
    this.authService.currentUser.subscribe(s => {
      if (s) {
        this.headerStatus = true;
      } else {
        this.headerStatus = false;
      }
    });
    return this.headerStatus;

  }

  loadOrganizationList() {
    this.orgservice.orglist().subscribe((data) => {
      if (data === null || data.count == 0 || data.response.length == 0) {
        this.dataService.OrganizationCreatedStatus.next(false);
        this.router.navigate(['settings/organizations']);
      } else {
        this.dataService.setOrganizationPropertyCreationStatus(true);
        this.dataService.OrganizationCreatedStatus.next(true);
      }
      this.orgList = Object.values(data)[1];
      this.leftItems = this.orgList;
      this.currentSelectedProperty();
      this.rightItems = [
        {
          label: 'User', icon: 'assets/imgs/glass.jpg',
          items: [
            { label: 'User Preferences', routerLink: '/userprofile', icon: 'edit-3' },
            { label: 'Organizations', routerLink: '/settings/organizations', icon: 'activity' },
            { label: 'Billing', routerLink: '/settings/billing/manage', icon: 'credit-card' },
            { label: 'Settings', routerLink: '/settings', icon: 'settings' },
            { label: 'Help Center', routerLink: 'https://support.adzapier.com', icon: 'help-circle' },
            { label: 'Signout', routerLink: '/signout', icon: 'log-out' }
          ]
        }];
      this.navigationMenu = [
        {
          showlink: 'Dashboard',
          subcategory: [{ showlink: 'DSAR', routerLink: '/home/dashboard/ccpa-dsar', icon: 'bar-chart-2' },
          // { showlink: 'GDPR', routerLink: '/pagenotfound', icon: 'pie-chart' },
          { showlink: 'Cookie Consent', routerLink: '/home/dashboard/cookie-consent', icon: 'fas fa-cookie feather-16' },
          { showlink: 'Consent Preference', routerLink: '/home/dashboard/consent-preference', icon: 'fas fa-cookie feather-16' }
          ]
        }, {
          showlink: 'Privacy',
          subcategory: [
            { showlink: 'Dashboard', routerLink: '/home/dashboard/ccpa-dsar', icon: 'bar-chart-2' },
            { showlink: 'Webforms', routerLink: '/privacy/dsar/webforms', icon: 'pie-chart' },
            { showlink: 'Requests', routerLink: '/privacy/dsar/requests', icon: 'fa fa-ticket-alt feather-16' },
            { showlink: 'Workflow', routerLink: '/privacy/dsar/workflows', icon: 'fas fa-sitemap' },

            { showlink: 'Dashboard', routerLink: '/home/dashboard/cookie-consent', icon: 'fas fa-cookie feather-16' },
            { showlink: 'Manage Vendors', routerLink: '/cookie-consent/manage-vendors', icon: 'fas fa-tasks feather-16' },
            { showlink: 'Cookie Category', routerLink: '/cookie-consent/cookie-category', icon: 'fab fa-microsoft feather-16' },
            { showlink: 'Cookie Banner', routerLink: '/cookie-consent/cookie-banner', icon: 'fas fa-cookie feather-16' },
            { showlink: 'Consent Tracking', routerLink: '/cookie-consent/cookie-tracking', icon: 'fas fa-file-contract feather-16' },
            { showlink: 'Setup', routerLink: '/cookie-consent/cookie-banner/setup', icon: 'fas fa-wrench feather-16' },

            { showlink: 'Dashboard', routerLink: '/home/dashboard/consent-preference', icon: 'fas fa-chart-line feather-16' },
            { showlink: 'Consent Records', routerLink: '/consent-solutions/consent-records', icon: 'fas fa-tasks feather-16' },
            { showlink: 'Setup', routerLink: '/consent-solutions/setup', icon: 'fas fa-wrench feather-16' },
          ]
        }, { showlink: 'Billing', routerLink: '/settings/billing/manage' }];
    }, (error) => {
      console.log(error);
    });



  }


  getLoggedInUserDetails() {
    this.isCollapsed = false;
    this.userService.getLoggedInUserDetails(this.constructor.name, moduleName.headerModule).subscribe((data) => {
      this.currentUser = data;
      this.resuserCID = this.currentUser.response.cID;
      this.currentLoggedInUser = this.currentUser.response.firstname + ' ' + this.currentUser.response.lastname;
      this.currentLoggedInUser = this.currentLoggedInUser.toLowerCase().split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
      this.userRole = this.currentUser.response.role;
      this.userID = this.currentUser.response.uid;
    });
  }

  isCurrentPropertySelected(org, prop) {
    if(this.location.path().indexOf('settings') == -1 || this.location.path().indexOf('userprofile') == -1){
      this.queryOID = org.id;
      this.queryPID = prop.property_id;
    this.currentNavigationUrl = this.location.path() == '/' ? '/home/welcome' : "/home/welcome?oid="+ this.queryOID +"&pid="+this.queryPID;
    }
    this.loading.start('2');
    this.selectedOrgProperties.length = 0;
    this.activeProp = prop.property_name;
    const obj = {
      organization_id: org.id,
      organization_name: org.orgname,
      property_id: prop.property_id,
      property_name: prop.property_name,
      property_active: prop.property_active,
      user_id: this.userID
    };
       this.orgservice.changeCurrentSelectedProperty(obj);
    // this.selectedOrgProperties.push(obj);
    //if(this.selectedOrgProperties.length == 0){
    const orgIndex = this.selectedOrgProperties.findIndex((t) => t.organization_id === obj.organization_id);
    if (orgIndex === -1) {
      this.selectedOrgProperties.push(obj);
    }
      //}
    //this.orgservice.setCurrentOrgWithProperty(obj); // two
    this.isPropSelected(obj);
    this.loadOrganizationPlanDetails(obj);
   // this.loading.start('1');
    this.loadPropertyPlanDetails(prop);
    

    this.licenseAvailabilityForFormAndRequestPerOrg(org);
    if (this.router.url.indexOf('dsarform') !== -1) {
      this.router.navigate(['/privacy/dsar/webforms']);
    }
    if (this.router.url.indexOf('createworkflow') !== -1) {
      this.router.navigate(['/privacy/dsar/workflows']);
    }
    this.router.navigate([this.router.url], { queryParams: { oid: obj.organization_id, pid: obj.property_id },skipLocationChange:false} );
   // this.openNav();
  }

  isPropSelected(selectedItem): boolean {
    if (selectedItem.property_id !== undefined) {
      this.isPropertySelected = this.selectedOrgProperties.filter((t) => t.property_id === selectedItem.property_id).length > 0 || this.selectedOrgProperties.some((t) => t.response !== undefined && t.response.id === selectedItem.property_id);
      return this.isPropertySelected;
    } 
      else if(selectedItem.response !== undefined && selectedItem.response.id !== undefined){
      this.isPropertySelected = this.selectedOrgProperties.some((t) => t.property_id === selectedItem.response.id) || this.selectedOrgProperties.some((t) => t.response !== undefined && t.response.id === selectedItem.response.id);
      return this.isPropertySelected;
      } else if(this.currentNavigationUrl[1] !== undefined && selectedItem.property_id === this.currentNavigationUrl[1]){ //this.isUrlWithPropID // this.findPropertyIDFromUrl(this.currentNavigationUrl)[1]
        return true;
      }
  
  }

  isOrgSelected(selectedItem): boolean {
    let orgIndex;
    this.oIDPIDFromURL = this.findPropertyIDFromUrl(this.location.path());
    if (this.orgPropertyMenu !== undefined) {
      if(this.oIDPIDFromURL !== undefined){
        orgIndex = this.orgPropertyMenu.findIndex((t) => t.id == this.oIDPIDFromURL[0]);
      }else{
        orgIndex = this.orgPropertyMenu.findIndex((t) => t.id == selectedItem.id);
      }
      if (orgIndex == -1) {
        this.selectedOrgProperties.push(this.orgPropertyMenu[orgIndex]);
      }
      if (this.selectedOrgProperties !== undefined && this.selectedOrgProperties.length > 0) {
        return this.selectedOrgProperties.some((t) => t.organization_id === selectedItem.id);
      }
    }
  }

  public trackByMethod(index: number): number {
    return index;
  }

  checkisCollapsed(): boolean {
    this.isCollapsed ? this.firstElement = true : this.firstElement = false;
    return this.isCollapsed = !this.isCollapsed;
  }

  nameInitials(str) {
    if (str !== undefined) {
      const firstChar = str.charAt(0);
      const spacePos = str.indexOf(' ');
      const secondChar = str.charAt(spacePos + 1);
      return firstChar + secondChar;
    }
  }

  currentSelectedProperty() {
    //this.selectedOrgProperties.lenghth = 0;
    // tslint:disable-next-line: max-line-length
    // this.orgservice.currentProperty.pipe(distinctUntilChanged()).subscribe((data) => {
    this.orgservice.isPropertyUpdated.subscribe((status) => { this.isPropertyUpdated = status });
   if(!this.isPropertyUpdated){
    this.orgservice.currentProperty.subscribe((data) => {
      if (data !== '' || data.length > 0) {
        this.currentProperty = data.property_name || data.response.name;
       // console.log(this.currentProperty,'523');
        this.currentOrganization = data.organization_name || data.response.orgname || data.response.name;
        if (this.currentProperty !== undefined) {
        if( this.selectedOrgProperties.length == 0){
          const orgIndex = this.selectedOrgProperties.findIndex((t) => t.organization_id === data.organization_id || data.response !== undefined && data.response.oid);
          if (orgIndex === -1) {
            this.selectedOrgProperties.push(data);
            this.licenseAvailabilityForProperty(data);
          }
         // this.isPropSelected(data);
        }
        }
      } 
      // else {
      //   this.loadOrgPropertyFromLocal();
      // }

    });
 }

    if (this.isPropertyUpdated) {
      this.orgservice.editedProperty.subscribe((prop) => {
        if (prop) {
          this.currentProperty = prop.response.name;
          const orgDetails = this.orgservice.getCurrentOrgWithProperty();
          orgDetails.property_name = prop.response.name;
          orgDetails.property_id = prop.response.id;
          this.orgservice.updateCurrentOrgwithProperty(orgDetails);
          this.isPropSelected(orgDetails);
           
        }
      });
      this.loadOrganizationWithProperty();  
      this.orgservice.isPropertyUpdated.next(null); 
    }
    

    if (this.isOrganizationUpdated) {
      this.orgservice.editedOrganization.subscribe((org) => {
        if (org) {
          this.currentOrganization = org.response.orgname;
          const orgDetails = this.orgservice.getCurrentOrgWithProperty();
          orgDetails.organization_id = org.response.id;
          orgDetails.organization_name = org.response.orgname;
          this.orgservice.updateCurrentOrgwithProperty(orgDetails);
        }
      });
    }
    
  }

  toggleNavbar() {
    this.navToggleStatus = !this.navToggleStatus;
  }

  openNav() {
    this.close = !this.close;
    this.addMobileMenuWidth = this.addMenuWidth(); // to avoid countinous background call
    this.addMobileBackdrop = this.addBackdrop(); // to avoid countinous background call
  }


  loadOrganizationWithProperty() {
    
    this.oIDPIDFromURL = this.findPropertyIDFromUrl(this.currentNavigationUrl || this.location.path());
    this.loading.start();
    this.orgservice.getOrganizationWithProperty().subscribe((data) => {
      this.loading.stop();
      this.orgPropertyMenu = data.response;
      this.checkCurrentManagingProperty();
     // this.resCID = data.response.cID || data.response[0].cID;
     
    }, (error) => {
      this.loading.stop();
    }, () => {
      console.log('complete..');
      if(this.currentNavigationUrl !== undefined){
      this.oIDPIDFromURL= this.findPropertyIDFromUrl(this.currentNavigationUrl || this.location.path());//updatedUrlWithPID
      }
     this.checkCurrentManagingProperty();
      });
    
  }


  checkCurrentManagingProperty(){
    if (this.orgPropertyMenu !== undefined && this.orgPropertyMenu.length > 0) {
      this.rearrangeFormSequence(this.orgPropertyMenu);
      //this.selectedOrgProperties.length = 0;
        if (this.orgPropertyMenu && this.orgPropertyMenu[0] && this.orgPropertyMenu[0].property[0] === undefined) {
          // this.router.navigate(['settings/organizations']);
          this.router.navigate(['settings/organizations/details/' + this.orgPropertyMenu[0].id]);
          return false;
        } else {
          if ( this.oIDPIDFromURL == undefined || this.oIDPIDFromURL.length == 0) { //this.isOrgPropertyEmpty() // this.queryOID == undefined // && this.isFirstPropertyExist() &&  !this.isUrlWithPropID // this.isOrgPropertyEmpty()
            let activePro = this.filterProp(this.orgPropertyMenu);
            const proIndex = activePro[0].property.findIndex((t) => t.property_active === true);
            this.activeProp = activePro[0].property[proIndex];
            const obj = {
              organization_id: activePro[0].id,
              organization_name: activePro[0].orgname,
              property_id: activePro[0].property[proIndex].property_id,
              property_name: activePro[0].property[proIndex].property_name,
              user_id: this.userID
            };
            this.selectedOrgProperties.push(obj);
            this.orgservice.changeCurrentSelectedProperty(obj); //check this..
            this.licenseAvailabilityForProperty(obj);
            this.loadOrganizationPlanDetails(obj);
          //  this.loading.start('1');
            this.loadPropertyPlanDetails(obj);
            //this.orgservice.setCurrentOrgWithProperty(obj); // three
            if(this.router.url.indexOf("manage?success") == -1){
              this.router.navigate([this.router.url], { queryParams: { oid: obj.organization_id, pid: obj.property_id }, queryParamsHandling:'merge', skipLocationChange:false} );
            } else{
              this.router.navigate(['settings/billing/manage'], { queryParams: { oid: obj.organization_id, pid: obj.property_id }, queryParamsHandling:'merge', skipLocationChange:false} );
            }
           // this.dataService.checkClickedURL.next('/home/welcome'+'?oid='+obj.organization_id+'&pid='+obj.property_id);
            // this.dataService.getPropertyPlanDetails(this.constructor.name, moduleName.cookieConsentModule, obj.property_id)
            // .subscribe((res: any) => {
            //   this.dataService.setPropertyPlanToLocalStorage(res);
            // });
            
            // this.orgservice.getSelectedOrgProperty.emit(obj);
            //  this.firstElement = false;
            
            this.licenseAvailabilityForFormAndRequestPerOrg(obj);
            // this.findPropertyIDFromUrl();
            // this.getPropertyDetailsFromUrl();
            // //let activePro = this.filterProp(this.orgPropertyMenu);
            // const propobj = activePro[0].property.filter((el)=>el.property_id === this.findPropertyIDFromUrl());
            // console.log(propobj,'propobj..550');
          } else {
            let activePro;
           // let url = this.findPropertyIDFromUrl();
            if(this.oIDPIDFromURL !== undefined){
              const findOidIndex = this.orgPropertyMenu.findIndex((t) => t.id == this.oIDPIDFromURL[0]) //finding oid
              if(findOidIndex !== -1){
                activePro = this.orgPropertyMenu[findOidIndex] //based on oid finding propid
              }
         
         const propobj = activePro !== undefined && activePro.property.filter((el)=>el.property_id === this.oIDPIDFromURL[1]);
         if(propobj){
         const obj = {
          organization_id: activePro.id,
          organization_name: activePro.orgname,
          property_id: propobj[0].property_id,
          property_name: propobj[0].property_name,
          user_id: this.userID
        };
         this.selectedOrgProperties.push(obj);
         // this.orgservice.getSelectedOrgProperty.emit(obj);
         //  this.firstElement = false;
       //  this.orgservice.setCurrentOrgWithProperty(obj); // one
         this.licenseAvailabilityForProperty(obj);
         this.licenseAvailabilityForFormAndRequestPerOrg(obj);
         this.isPropSelected(obj);
         this.orgservice.changeCurrentSelectedProperty(obj); //check this..
         this.loadOrganizationPlanDetails(obj);
         //  this.loading.start('1');
           this.loadPropertyPlanDetails(obj);
      }
            // this.activeProp = activePro[0].property[proIndex];
            // const obj = {
            //   organization_id: activePro[0].id,
            //   organization_name: activePro[0].orgname,
            //   property_id: activePro[0].property[proIndex].property_id,
            //   property_name: activePro[0].property[proIndex].property_name,
            //   user_id: this.userID
            // };

         this.getPropertyDetailsFromUrl();
        // this.loadOrgPropertyFromLocal(); // four
            }
          }
        }

    } 
    //else {
     // this.dataService.checkClickedURL.next('/home/welcome'+'?oid='+this.queryOID+'&pid='+this.queryPID);
     // this.router.navigate(['settings/organizations']);
   // }
  }

  getColumnCountSize() {
    return this.orgPropertyMenu.length < 3 ? 2 : 4;
  }

  filterProp(propArry) {
    let activePro = [];
    for (let i = 0; i < propArry.length; i++) {
      if (propArry[i].property.some((t) => t.property_active === true)) {
        activePro.push(propArry[i]);
        break;
      }
    }
    return activePro;
  }

  findProperty(propArry,pid) {
    let activePro = [];
    for (let i = 0; i < propArry.length; i++) {
      if (propArry[i].property.some((t) => t.property_active === true)) {
        activePro.push(propArry[i]);
        break;
      }
    }
    return activePro;
  }

  checkPropertyStatus(prop): boolean {
    if (this.propList) {
      return this.propList.filter((t) => t.id === prop.property_id && t.active === false).length > 0;
    }
  }

  loadOrgPropertyFromLocal() {
    this.selectedOrgProperties.length = 0;
      const orgIndex = this.orgPropertyMenu.findIndex((t) => t.organization_id === this.queryOID);
      if (orgIndex === -1) {
        this.selectedOrgProperties.push(this.orgPropertyMenu[orgIndex]);
      }
      this.isPropSelected(this.orgPropertyMenu[orgIndex]);
      this.licenseAvailabilityForFormAndRequestPerOrg(this.orgPropertyMenu[orgIndex]);
      this.licenseAvailabilityForProperty(this.orgPropertyMenu[orgIndex]);

   // const orgDetails = this.orgservice.getCurrentOrgWithProperty();
   // if (orgDetails !== undefined && orgDetails.length > 0) {
      if (this.orgPropertyMenu[orgIndex].user_id) { //=== this.userID
        this.currentOrganization = this.orgPropertyMenu[orgIndex].organization_name !== '' ? this.orgPropertyMenu[orgIndex].organization_name : this.orgPropertyMenu[orgIndex].response.orgname;
        this.currentProperty = this.orgPropertyMenu[orgIndex].property_name;
    
      }
      //  return this.currentProperty;
   // }

  }

  rearrangeFormSequence(dataArray) {
    dataArray.sort((a, b) => {
      if (a.orgname > b.orgname) {
        return 1;
      }
      if (b.orgname > a.orgname) {
        return -1;
      }
      return 0;
    });
    return dataArray;
  }
  // check whether organizaion property was earlier selected
  isOrgPropertyExists(data): boolean {
    const orgDetails = this.orgservice.getCurrentOrgWithProperty();
    if (orgDetails !== undefined && orgDetails.length > 0) {
      const result = data.filter((t) => t.id === orgDetails.organization_id).length > 0 || data.some((t) => t.id === orgDetails.response.oid);
      const isSameUserLoggedin = this.userID === orgDetails.user_id || orgDetails.uid;
      if (result && isSameUserLoggedin) {
        this.licenseAvailabilityForFormAndRequestPerOrg(orgDetails);
        return true;
      }
    }
  }

  isOrgPropertyEmpty(): boolean {
    return this.orgservice.getCurrentOrgWithProperty() == undefined;// ? true : false;
  }

  goto(link: any, id?: any) {
    this.oIDPIDFromURL= this.findPropertyIDFromUrl(this.location.path());
    this.currentNavigationUrl = link.routerLink == '/' ? '/home/welcome' : link.routerLink + "?oid="+ this.queryOID +"&pid="+this.queryPID;
    if (link.routerLink === '/home/dashboard/cookie-consent' || link.routerLink === '/cookie-consent/manage-vendors' || link.routerLink === '/cookie-consent/cookie-category'
      || link.routerLink === '/cookie-consent/cookie-banner' || link.routerLink === '/cookie-consent/cookie-tracking' || link.routerLink === '/cookie-consent/cookie-banner/setup') {
      if (this.selectedOrgProperties.length > 0) {
        this.dataService.checkClickedURL.next(link.routerLink);
        this.onCheckAllowCookieConsentDashboard();
        if (!this.isShowDashboardForCookieConsent) {
          return false;
        }
      } else {
        this.openModal(this.confirmModal);
        return false;
      }
    }

    if (link.routerLink === '/home/dashboard/ccpa-dsar' || link.routerLink == '/privacy/dsar/webforms' || link.routerLink == '/privacy/dsar/requests' || link.routerLink == '/privacy/dsar/workflows') {
      if (this.selectedOrgProperties.length > 0) {
        this.checkForUpgradeDSAR();
        if (!this.isShowDashboardForDsar) {
          return false;
        }
      } else {
        this.openModal(this.confirmModal);
        return false;
      }
    }

    if (id !== undefined) {
      this.router.navigate([link.routerLink || link, id]); //,{queryParams:{'oid':id,'pid':id}}
    } else {
      if (this.checkLinkAccess(link.routerLink || link)) {
        if (this.queryPID !== undefined) {//this.selectedOrgProperties.length > 0
          if (this.queryOID && this.queryPID) {
            this.router.navigate([link.routerLink || link], { queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling: 'merge', skipLocationChange: false });
          } else {
            this.oIDPIDFromURL = this.findPropertyIDFromUrl(this.location.path());
            this.router.navigate([link.routerLink || link], { queryParams: { oid: this.oIDPIDFromURL[0], pid: this.oIDPIDFromURL[1] }, queryParamsHandling: 'merge', skipLocationChange: false });
          }
          this.activateActiveClass(link);
        } else {
          this.openModal(this.confirmModal);
          return false;
        }
      }
    }
  }

  checkLinkAccess(link): boolean {
    if (link.indexOf('cookie') !== -1 || link.indexOf('privacy') !== -1 || link.indexOf('webform') !== -1 ||
      link.indexOf('ccpa') !== -1 || link.indexOf('billing') !== -1) {
      return true;
    } else {
      if(this.queryOID != null && this.queryPID != null){
      this.router.navigate([link.routerLink || link],{ queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling:'merge', skipLocationChange:false});
      }
      this.activateActiveClass(link);
    }
  }

  activateActiveClass(menu: any) {
    this.selectedSubmenu.length = 0;
    this.selectedSubmenu.push(menu);
    const navLink = menu.routerLink || menu;
    if (navLink.indexOf('settings/billing') !== -1 || navLink.indexOf('pricing') !== -1) {
      this.isBillingActivelinkMatched = true;
      if (menu.icon !== undefined) {
        this.activateSublink(menu);
      }
      return this.isPrivacyActivelinkMatched = false;
    } else if (navLink.indexOf('/settings') >= 0) {
      if (menu.icon !== undefined || menu !== undefined) {
        this.activateSublink(menu);
      }
    } else {
      this.isBillingActivelinkMatched = false;
      this.openNav();
    }
  }

  activateSublink(selectedItem): boolean {
    return this.isSublinkActive = this.selectedSubmenu.some((t) =>  t === selectedItem) || this.selectedSubmenu.some((q) => q.routerLink === selectedItem.routerLink)
  }

  activateSublinkConsentPreference(selectedItem): boolean {
    return this.isSublinkActive = this.selectedSubmenu.some((t) => t === selectedItem.routerLink);
  }

  isFirstPropertyExist(): boolean {
    if (this.orgPropertyMenu[0] !== undefined) {
      return this.orgPropertyMenu[0].property !== undefined && this.orgPropertyMenu[0].property[0] !== undefined
    }
  }

  confirm() {
    this.modalRef.hide();
    if (this.orgPropertyMenu[0] !== undefined) {
      this.router.navigate(['settings/organizations/details/' + this.orgPropertyMenu[0].id]);
    } else {
      this.router.navigate(['settings/organizations']);
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.bsmodalService.show(template, { class: 'modal-sm' });
  }

  loadNotification() {
    //this.isNotificationBellClicked = true;
    this.userService.getNotification(this.constructor.name, moduleName.headerModule).subscribe((data) => {
      this.notificationList = data.response.notification_data;
      this.storeNotificationList = [...this.notificationList];
      this.notificationsNumber = data.response.new_count;
      this.cdRef.markForCheck();
    });
  }

  onClickNotificationBell() {
    this.userService.checkIsNotificationVisited(this.constructor.name, moduleName.headerModule).subscribe((data) => {
      if (data.status === 200) {
        this.loadNotification();
      }
    });
  }

  clearNotification(requestid, purpose: string, status: boolean) {
    const i = this.storeNotificationList.findIndex((t) => t.id === requestid)
    let obj;
    if (purpose === 'read') {
      obj = {
        id: [requestid],
        read: !status, // false,
      };
    } else {
      obj = {
        id: [requestid],
        active: status // false
      };
    }
    this.userService.updateNotification(this.constructor.name, moduleName.headerModule, obj)
      .subscribe((data) => {
        if (data.status === 200 && purpose == 'read') {
          this.storeNotificationList[i].read = !status;
          this.storeNotificationList = [...this.storeNotificationList];

        } else {
          this.storeNotificationList[i].active = false;
          this.storeNotificationList = [...this.storeNotificationList];
        }

      });
  }

  isProperyDisabled(item): boolean {
    return item.property_active === null || false;
  }

  readAllNotification(reqdata) {
    const readIds = [];
    for (const key of Object.keys(reqdata)) {
      readIds.push(reqdata[key].id);
    }
    let obj;
    obj = {
      id: readIds,
      read: false, // false,
    };
    this.userService.updateNotification(this.constructor.name, moduleName.headerModule, obj).subscribe((data) => {
      this.loadNotification();
    });
  }

  addColumncount(): object {
    if (this.orgPropertyMenu.length < 2) {
      return { 'column-count': 1 }
    } else if (this.orgPropertyMenu.length <= 2) {
      return { 'column-count': 2 }
    } else if (this.orgPropertyMenu.length >= 4 && this.orgPropertyMenu.length <= 5) {
      return { 'column-count': 2 }
    } else if (this.orgPropertyMenu.length >= 4 && this.orgPropertyMenu.length <= 8) {
      return { 'column-count': 3 }
    } else if (this.orgPropertyMenu.length >= 8) {
      return {
        'column-count': 4,
        'overflow-x': "scroll",
        'width': "950px",
        'position': "absolute",
        'min-height': "490px",
        'overflow-y': "auto",
        'height': "300px",
        'top': '0'
      }
    }

  }

  toggleSideNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }


  onMobileMenuClicked(link) {

    if (link === 'Dashboard' && this.isMobileDashboardMenuCollapsed) {
      this.isMobileDashboardMenuCollapsed = false;
      this.isMobilePrivacyMenuCollapsed = true;
      this.isMobilePropertyCollapsed = true;
    } else if (link === 'Dashboard' && !this.isMobileDashboardMenuCollapsed) {
      this.isMobileDashboardMenuCollapsed = true;
      this.isMobilePrivacyMenuCollapsed = true;
      this.isMobilePropertyCollapsed = true;
    } else if (link === 'Privacy' && this.isMobilePrivacyMenuCollapsed) {
      this.isMobilePrivacyMenuCollapsed = false;
      this.isMobileDashboardMenuCollapsed = true;
      this.isMobilePropertyCollapsed = true;
    } else if (link === 'Privacy' && !this.isMobilePrivacyMenuCollapsed) {
      this.isMobileDashboardMenuCollapsed = true;
      this.isMobilePrivacyMenuCollapsed = true;
      this.isMobilePropertyCollapsed = true;
    } else {
      this.goto(link); // for billing link
      this.openNav();
    }
  }

  collapseStatus(activeIndex): boolean {
    if (activeIndex === 0) {
      return activeIndex == 0 && this.isMobileDashboardMenuCollapsed;
    } else {
      return activeIndex == 1 && this.isMobilePrivacyMenuCollapsed;
    }
  }

  onMobilePropertyMenuClicked(status) {
    if (status) {
      this.isMobilePropertyCollapsed = !this.isMobilePropertyCollapsed;
      this.isMobilePrivacyMenuCollapsed = true;
      this.isMobileDashboardMenuCollapsed = true;
    }

  }

  addMenuWidth() {
    let textLength;
    if (this.currentOrganization !== undefined) {
      textLength = this.currentOrganization.length;
      let generatedWidth = (textLength * 10) <= 250 ? 250 : textLength * 10;
      let addStyle = {
        'width': generatedWidth + 'px',
        'left': !this.close ? 0 : '-' + generatedWidth + 'px',
        'transform': !this.close ? 'translateX(0)' : 'translateX(-' + generatedWidth + 'px)',
        'padding': 0
      };
      return addStyle;
    } else {
      let addStyle = {
        'width': 260 + 'px',
        'left': !this.close ? 0 : '-' + 26 * 10 + 'px',
        'transform': !this.close ? 'translateX(0)' : 'translateX(-' + 26 * 10 + 'px)',
        'padding': 0
      };
      return addStyle;
    }
  }

  addBackdrop() {
    let textLength = this.currentOrganization.length;
    let generatedWidth = (textLength * 10) <= 250 ? 250 : textLength * 10;
    if (!this.close) {
      let backDropStyle = {
        'opacity': !this.close ? 1 : 0,
        'visibility': !this.close ? 'visible' : 'hidden',
        'left': !this.close ? generatedWidth + 'px' : 0
      };
      return backDropStyle;
    }

  }

  convertAmpersand(item) {
    if (item !== undefined) {
      return item.replace(/&amp;/g, '&');
    }
  }

  licenseAvailabilityForFormAndRequestPerOrg(org) {
    this.dataService.checkLicenseAvailabilityPerOrganization(org).subscribe(results => {
      let finalObj = {
        ...results[0].response,
        ...results[1].response,
        ...results[2].response
      }
      this.dataService.setAvailableLicenseForFormAndRequestPerOrg(finalObj);
      if (finalObj !== null && Object.keys(finalObj).length !== 0) {
        this.dataService.isLicenseApplied.next({ requesttype: 'organization', hasaccess: true });
        this.onCheckSubscriptionForOrg();
      }else{
        this.dataService.isLicenseApplied.next({ requesttype: 'organization', hasaccess: false });
      }
    }, (error) => {
      console.log(error)
    });
  }

  isLicenseLimitAvailable(requestType): boolean {
    const status = this.dataService.isLicenseLimitAvailableForOrganization(requestType, this.dataService.getAvailableLicenseForFormAndRequestPerOrg());
    if (!status) {
      return status;
    } else {
      return status;
    }
  }

  licenseAvailabilityForProperty(prop) {
    this.dataService.checkLicenseAvailabilityForProperty(prop).subscribe(result => {
      this.dataService.setPropertyPlanToLocalStorage(result[0]);
      this.onCheckSubscriptionForProperty();
      this.onCheckConsentPreferenceSubscription();
    }, (error) => {
      console.log(error);
    })
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event) {
    if (event.target.outerWidth <= 767) {
      if (!this.close) {
        this.close = true;
        this.addMobileMenuWidth = this.addMenuWidth();
        this.addMobileBackdrop = this.addBackdrop();
      }
    }
  }




  onCheckSubscriptionForProperty() {
    const resData: any = this.dataService.getCurrentPropertyPlanDetails();
    if (resData.hasOwnProperty('response')) {
      if (resData.response && resData.response.plan_details && resData.response.plan_details.consentPreference) {
        if (Object.values(resData.response.plan_details.consentPreference).length > 0) {
          this.dataService.isConsentPreferenceApplied.next({ requesttype: 'consentpreference', hasaccess: true })
        } else {
          this.dataService.isConsentPreferenceApplied.next({ requesttype: 'consentpreference', hasaccess: false });
          //this.router.navigate(['/home/welcome']);
          // this.dataService.openUpgradeModalForConsentPreference(resData);
        }
      }
      if (resData.response && resData.response.plan_details && resData.response.plan_details.cookieConsent) {
        if (Object.values(resData.response.plan_details.cookieConsent).length > 0) {
          this.isShowDashboardForCookieConsent = true;
          this.dataService.isLicenseAppliedForProperty.next({ requesttype: 'property', hasaccess: true });
        } else {
          this.dataService.isLicenseAppliedForProperty.next({ requesttype: 'property', hasaccess: false });
          this.isShowDashboardForCookieConsent = false;
          // if (this.router.url.indexOf('settings') == -1) {
          //   this.router.navigate(['/home/welcome']);
          // }
          //this.dataService.openUpgradeModalForCookieConsent(resData);
        }
      }
      // if (resData.response.hasOwnProperty('features')) {
      //   const features = resData.response.features;
      //   if (features == null) {
      //     this.isShowDashboardForCookieConsent = false;
      //     this.dataService.isLicenseAppliedForProperty.next({ requesttype: 'property', hasaccess: false });
      //   } else {
      //     if (Object.keys(features).length > 0) {
      //       this.isShowDashboardForCookieConsent = true;
      //       this.dataService.isLicenseAppliedForProperty.next({ requesttype: 'property', hasaccess: true });
      //     } else {
      //       this.isShowDashboardForCookieConsent = false;
      //       this.dataService.isLicenseAppliedForProperty.next({ requesttype: 'property', hasaccess: false });
      //     }
      //   }
      // }
    }
  }

  onCheckSubscriptionForOrg() {
    const resData: any = this.dataService.getCurrentOrganizationPlanDetails();
    if (resData.hasOwnProperty('response')) {
      if (resData.response.hasOwnProperty('features')) {
        const features = resData.response.features;
        if (features == null) {
          this.isShowDashboardForDsar = false;
          this.dataService.isLicenseApplied.next({ requesttype: 'organization', hasaccess: false });
          this.dataService.openUpgradeModalForDsar(resData);
        } else {
          if (Object.keys(features).length > 0) {
            this.isShowDashboardForDsar = true;
            this.dataService.isLicenseApplied.next({ requesttype: 'organization', hasaccess: true });
          } else {
            this.isShowDashboardForDsar = false;
            this.dataService.isLicenseApplied.next({ requesttype: 'organization', hasaccess: false });
            this.dataService.openUpgradeModalForDsar(resData);
          }
        }
      }
    }
  }

  onCheckAllowOrgDashboard() {
    this.planDetails = this.dataService.getCurrentOrganizationPlanDetails();
    if (!this.isShowDashboardForDsar) {
      this.dataService.openUpgradeModalForDsar(this.planDetails);
    }
  }

  checkForUpgradeDSAR() {
    let orglicenseStatus;
    this.planDetails = JSON.stringify(this.dataService.getCurrentOrganizationPlanDetails());
    
    let isorgplanExist; // check on page refresh
    if(JSON.parse(this.planDetails).response && JSON.parse(this.planDetails).response.plan_details &&  JSON.parse(this.planDetails).response.plan_details.dsar){
      if(Object.values(JSON.parse(this.planDetails).response.plan_details.dsar).length > 0){
        isorgplanExist = true;
      }
    }
    this.dataService.isLicenseApplied.subscribe((status) => {
      orglicenseStatus = status.hasaccess;
    });
    if (!orglicenseStatus && !isorgplanExist) {
      this.dataService.openUpgradeModalForDsar(this.planDetails);
    }
  }

  onCheckAllowCookieConsentDashboard() {
    this.planDetails = this.dataService.getCurrentPropertyPlanDetails();
    if (!this.isShowDashboardForCookieConsent) {
      this.dataService.openUpgradeModalForCookieConsent(this.planDetails);
    }
  }

  isLicenseAssignedForOrganization(item): boolean {
    return this.orgList.some((t) => t.id == item.id && !t.license_assigned);
  }

  isLicenseAssignedForProperty(item): boolean {
    return !item.license_assigned
  }

  btnTopAddSubscription() {
    this.router.navigate(['/settings/billing/pricing'],{ queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling:'merge', skipLocationChange:false});
  }

  addEllipsis(): object {
    let count;
    if (this.currentProperty !== "" && this.currentProperty !== undefined) {
      count = this.currentProperty.length;
    }
    if (count > 15) {
      return {
        "width": "115px"
      }
    } else {
      return {
        "width": "auto"
      }
    }

  }

  findPropertyIDFromUrl(urlLink){
    let oIDFromURL;
    if(urlLink !== undefined){
    if(urlLink.indexOf('pid') !== -1){
      this.isUrlWithPropID = true;
      if(urlLink.indexOf('?oid=') !== -1){
        oIDFromURL = urlLink.split("?oid=");
      }else{
        oIDFromURL = urlLink.split("&oid=");
      }
      return  oIDFromURL[1].split("&pid=");
    }
    }
    
  }

  getPropertyDetailsFromUrl(){
    if(this.orgPropertyMenu !== undefined && this.orgPropertyMenu.length > 1){
      for(const key of this.orgPropertyMenu){
        if(this.oIDPIDFromURL !== undefined){
        const obj = key.property.filter((el)=>el.property_id == this.oIDPIDFromURL[1]);
        }
      }
      
     
    }

  }

  loadOrganizationPlanDetails(org){
    this.dataService.removeOrgPlanFromLocalStorage();
    this.dataService.getOrgPlanInfo(this.constructor.name, moduleName.cookieConsentModule, org.organization_id || org.id)
    .subscribe((res: any) => {
      this.loading.stop('2')
      this.dataService.setOrgPlanToLocalStorage(res);
      if (res.response && res.response.plan_details && res.response.plan_details.dsar) {
        if (Object.values(res.response.plan_details.dsar).length > 0) {
          this.isShowDashboardForDsar = true;
         return this.dataService.isLicenseApplied.next({ requesttype: 'organization', hasaccess: true });
        } else {
          this.isShowDashboardForDsar = false;
          // this.dataService.isLicenseApplied.next({ requesttype: 'organization', hasaccess: false });
          //this.dataService.openUpgradeModalForDsar(res);
          if (this.router.url.indexOf('ccpa-dsar') !== -1) {
            if(this.queryOID && this.queryPID){
            this.router.navigate(['/home/dashboard/analytics'],{ queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling:'merge', skipLocationChange:false});
          }
        }
        }
      }
    }, error => {
      this.loading.stop('2')
    });
  }

  loadPropertyPlanDetails(prop){
    this.dataService.removePropertyPlanFromLocalStorage();
    this.oIDPIDFromURL = this.findPropertyIDFromUrl(this.location.path());
    this.dataService.getPropertyPlanDetails(this.constructor.name, moduleName.cookieConsentModule, prop.property_id)
    .subscribe((res: any) => {
      this.dataService.setPropertyPlanToLocalStorage(res);
      this.loading.stop('1')
      this.currentSelectedProperty();
      if(this.queryOID !== null && this.queryOID !== undefined){
        if(this.router.url.indexOf('oid') == -1){
          return this.router.navigate([this.router.url], { queryParams: { oid: this.queryOID, pid: this.queryPID }, skipLocationChange:false} );
        }
      } else {
        if (this.oIDPIDFromURL !== undefined && this.oIDPIDFromURL.length !== 0) {
          this.queryOID = this.oIDPIDFromURL[0];
          this.queryPID = this.oIDPIDFromURL[1];
          return this.router.navigate([this.router.url], { queryParams: { oid: this.oIDPIDFromURL[0], pid: this.oIDPIDFromURL[1] }, skipLocationChange: false });
        }
      }

      // this.onCheckSubscriptionForProperty();
      // this.onCheckSubscriptionForOrg();
      this.onCheckConsentPreferenceSubscription();
    }, err => {
      this.loading.stop('1')
    });
  }

  // propertyMouseOver(){
  //   this.currentNavigationUrl = this.router.url;// + '?' + oid + '&' + pid;
  // }

  navigateToWelcomepage(){
    this.activatedroute.queryParamMap
    .subscribe(params => {
      this.queryOID = params.get('oid');
      this.queryPID = params.get('pid');
      this.loadOrganizationWithProperty();
     });
     if(this.queryOID !== null && this.queryOID !== undefined){
       this.router.navigate(['/home/dashboard/analytics'],{ queryParams: { oid: this.queryOID, pid: this.queryPID },  skipLocationChange:false});
     }else if(this.selectedOrgProperties.length !== 0){
       this.router.navigate(['/home/dashboard/analytics'],{ queryParams: { oid: this.selectedOrgProperties[0].organization_id, pid: this.selectedOrgProperties[0].property_id },  skipLocationChange:false});
     }else{
       this.router.navigate(['settings/organizations']);
     }
  }

  getCurrentRoute(){
    if(this.currentNavigationUrl !== undefined){
      return this.currentNavigationUrl.split('?')[0];
    } else{
      return this.location.path().split('?')[0];
    }
  }

  ngAfterViewInit() {
    this.activatedroute.queryParamMap.subscribe(params => {
      this.queryOID = params.get('oid');
      this.queryPID = params.get('pid');
    });
    //if logout from one tab, all tab redirect to login page
   // if (event !== undefined && event.storageArea.length === 0) {
      if (this.router !== undefined && this.router.url.indexOf('/verify-email') !== -1 || this.location.path().indexOf('/verify-email') !== -1) {
        let urlpartone = this.location.path().split("?oid=");
        let urlparttwo = urlpartone[0].split("?pid=");
        let verifyToken = urlparttwo[0].split("verify-email/")
        // this.router.navigate([urlparttwo[0]]);
        sessionStorage.clear();
        //this.router.navigate(['/signup'], { relativeTo: this.activatedRoute });
        this.router.navigate(["/signup"],{ queryParams: { id: verifyToken[1] }});
        //this.router.navigate(['/privacy/dsar/dsarform', obj.web_form_id]);
        
      } else if (this.location.path().indexOf("manage?success") == -1) {
        this.oIDPIDFromURL = this.findPropertyIDFromUrl(this.currentNavigationUrl || this.location.path());
        const url = this.location.path() == '/' ? '/home/welcome' : this.getCurrentRoute();
        if(this.oIDPIDFromURL !== undefined){
          this.router.navigate([url], { queryParams: { oid: this.oIDPIDFromURL[0], pid: this.oIDPIDFromURL[1] }, skipLocationChange: false });
        }
      } else {
        this.router.navigate(['/home/dashboard/analytics']);
        //this.router.navigate(['/login']);
      }
    
  }

  ngOnDestroy(){
    if(this.orgservice.isPropertyUpdated !== undefined){
      this.orgservice.isPropertyUpdated.unsubscribe();
    }
  }
  
}
