import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { OrganizationService, AuthenticationService, UserService } from '../../../_services';
import { Observable } from 'rxjs';
import { Organization } from 'src/app/_models/organization';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { moduleName } from 'src/app/_constant/module-name.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Location } from '@angular/common';
import { DataService } from 'src/app/_services/data.service';
import {featuresName} from '../../../_constant/features-name.constant';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HeaderComponent implements OnInit {
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
  isPropertySelected: boolean;
  isPrivacyActivelinkMatched = false;
  isBillingActivelinkMatched = false;
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
        this.loadOrganizationWithProperty();
        this.loadNotification();
      }
    });

    this.orgservice.isOrganizationUpdated.subscribe((t) => {
      this.isOrganizationUpdated = t;
      if (this.isOrganizationUpdated) {
        this.loadOrganizationWithProperty();
        this.currentSelectedProperty();
        this.loadNotification();
      }
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.indexOf('signup') >= 0) {
          if (this.currentUser === null) {
            return true;
          } else {
            this.router.navigate(['/home/welcome']);
          }
        }
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
    //  this.firstElement = true;
    this.isCollapsed = false;
    this.userService.getCurrentUser.subscribe((data) => {
      if (data) {
        this.currentUser = data;
        this.isCollapsed = false;
        this.currentLoggedInUser = this.currentUser.response.firstname + ' ' + this.currentUser.response.lastname;
        this.userRole = this.currentUser.response.role;
        this.userID = this.currentUser.response.uid;
        this.loadOrganizationWithProperty();
        this.loadNotification();
      }
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
          this.router.navigate(['/login']);
          sessionStorage.clear();
        }
      }
    });
    this.onCheckConsentPreferenceSubscription();
  }


  onCheckConsentPreferenceSubscription() {
    this.planDetails = this.dataService.getCurrentPropertyPlanDetails();
    if(this.planDetails !== ""){
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
            { label: 'Help Center', routerLink: 'https://adzapier.atlassian.net/wiki/spaces/PD/pages/884637701/Adzapier+Portal', icon: 'help-circle' },
            { label: 'Signout', routerLink: '/signout', icon: 'log-out' }
          ]
        }];
      this.navigationMenu = [
        {
          showlink: 'Dashboard',
          subcategory: [{ showlink: 'DSAR', routerLink: '/home/dashboard/ccpa-dsar', icon: 'bar-chart-2' },
          // { showlink: 'GDPR', routerLink: '/pagenotfound', icon: 'pie-chart' },
          { showlink: 'Cookie Consent', routerLink: '/home/dashboard/cookie-consent', icon: 'fas fa-cookie feather-16' },
          { showlink: 'Consent Preference', routerLink: '/home/dashboard/consent-preference' , icon: 'fas fa-cookie feather-16'}
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

  async isCurrentPropertySelected(org, prop) {
    this.loading.start('2');
    this.dataService.getOrgPlanInfo(this.constructor.name, moduleName.cookieConsentModule, org.id)
      .subscribe((res: any) => {
        this.loading.stop('2')
        this.dataService.setOrgPlanToLocalStorage(res);
          if(res.response && res.response.plan_details &&  res.response.plan_details.dsar){
            if(Object.values(res.response.plan_details.dsar).length > 0){
          this.isShowDashboardForDsar = true;
          this.dataService.isLicenseApplied.next({ requesttype: 'organization', hasaccess: true });
            } else {
              this.isShowDashboardForDsar = false;
              this.dataService.isLicenseApplied.next({ requesttype: 'organization', hasaccess: false });
              //this.dataService.openUpgradeModalForDsar(res);
              if (this.router.url.indexOf('ccpa-dsar') !== -1) {
                this.router.navigate(['/home/dashboard/analytics']);
              }
            }
        }
      }, error => {
        this.loading.stop('2')
      });
    this.loading.start('1');
    this.dataService.getPropertyPlanDetails(this.constructor.name, moduleName.cookieConsentModule, prop.property_id)
      .subscribe((res: any) => {
        this.dataService.setPropertyPlanToLocalStorage(res);
        this.loading.stop('1')
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
        const orgIndex = this.selectedOrgProperties.findIndex((t) => t.organization_id === obj.organization_id);
        if (orgIndex === -1) {
          this.selectedOrgProperties.push(obj);
        }
        this.orgservice.setCurrentOrgWithProperty(obj);
        this.currentSelectedProperty();
        if (this.router.url.indexOf('privacy/dsar/requests-details') !== -1) {
          this.router.navigate(['/privacy/dsar/requests']);
        } else {
          this.router.navigate([this.router.url]);
        }

        // this.onCheckSubscriptionForProperty();
        // this.onCheckSubscriptionForOrg();
        this.onCheckConsentPreferenceSubscription();
      }, err => {
        this.loading.stop('1')
      });
    this.licenseAvailabilityForFormAndRequestPerOrg(org);
    if (this.router.url.indexOf('dsarform') !== -1) {
      this.router.navigate(['/privacy/dsar/webforms']);
    }
    if (this.router.url.indexOf('createworkflow') !== -1) {
      this.router.navigate(['/privacy/dsar/workflows']);
    }
    this.openNav();
  }

  isPropSelected(selectedItem): boolean {
    if (!this.isProperyDisabled(selectedItem)) {
      this.isPropertySelected = this.selectedOrgProperties.filter((t) => t.property_id === selectedItem.property_id).length > 0
        ? true : false;
      return this.isPropertySelected;
    }
  }

  isOrgSelected(selectedItem): boolean {
    return this.selectedOrgProperties.filter((t) => t.organization_id === selectedItem.id).length > 0;
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
    // tslint:disable-next-line: max-line-length
    this.orgservice.currentProperty.pipe(distinctUntilChanged())
      .subscribe((data) => {
        if (data) {
          this.currentProperty = data.property_name;
          this.currentOrganization = data.organization_name || data.response.orgname;
          if (this.currentProperty !== undefined) {
            const orgIndex = this.selectedOrgProperties.findIndex((t) => t.organization_id === data.organization_id);
            if (orgIndex === -1) {
              this.selectedOrgProperties.push(data);
              this.licenseAvailabilityForProperty(data);
            }
            this.isPropSelected(data);
          }
        }

      });

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

    this.orgservice.editedOrganization.subscribe((org) => {
      if (org) {
        this.currentOrganization = org.response.orgname;
        const orgDetails = this.orgservice.getCurrentOrgWithProperty();
        orgDetails.organization_id = org.response.id;
        orgDetails.organization_name = org.response.orgname;
        this.orgservice.updateCurrentOrgwithProperty(orgDetails);
      } else {
        this.loadOrgPropertyFromLocal();
      }
    });

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
    this.loading.start();
    this.orgservice.getOrganizationWithProperty().subscribe((data) => {
      this.loading.stop();
      this.orgPropertyMenu = data.response;
      this.resCID = data.response.cID;
      if (data.response.length > 0) {
        this.rearrangeFormSequence(this.orgPropertyMenu);
        this.selectedOrgProperties.length = 0;
        if (!this.isOrgPropertyExists(this.orgPropertyMenu)) {
          if (typeof this.orgPropertyMenu[0].property[0] === 'undefined') {
            // this.router.navigate(['settings/organizations']);
            this.router.navigate(['settings/organizations/details/' + this.orgPropertyMenu[0].id]);
            return false;
          } else {
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

            this.licenseAvailabilityForProperty(obj);
            this.dataService.checkClickedURL.next('/home/welcome');
            // this.dataService.getPropertyPlanDetails(this.constructor.name, moduleName.cookieConsentModule, obj.property_id)
            // .subscribe((res: any) => {
            //   this.dataService.setPropertyPlanToLocalStorage(res);
            // });
            this.orgservice.changeCurrentSelectedProperty(obj);
            // this.orgservice.getSelectedOrgProperty.emit(obj);
            //  this.firstElement = false;
            this.orgservice.setCurrentOrgWithProperty(obj);
            this.licenseAvailabilityForFormAndRequestPerOrg(obj);
          }
        } else {
          this.currentSelectedProperty();
        }

      } else {
        this.router.navigate(['settings/organizations']);
      }
    }, (error) => {
      this.loading.stop();
    });
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

  checkPropertyStatus(prop): boolean {
    if (this.propList) {
      return this.propList.filter((t) => t.id === prop.property_id && t.active === false).length > 0;
    }
  }

  loadOrgPropertyFromLocal() {
    const orgDetails = this.orgservice.getCurrentOrgWithProperty();
    if (orgDetails !== undefined) {
      if (orgDetails.user_id === this.userID) { //=== this.userID
        this.currentOrganization = orgDetails.organization_name ? orgDetails.organization_name : orgDetails.response.orgname;
        this.currentProperty = orgDetails.property_name;
        const orgIndex = this.selectedOrgProperties.findIndex((t) => t.organization_id === orgDetails.organization_id);
        if (orgIndex === -1) {
          this.selectedOrgProperties.push(orgDetails);
        }
        this.isPropSelected(orgDetails);
        this.licenseAvailabilityForFormAndRequestPerOrg(orgDetails);
      }
      return this.currentProperty;
    }

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
    if (orgDetails !== undefined) {
      const result = data.filter((t) => t.id === orgDetails.organization_id).length > 0;
      const isSameUserLoggedin = orgDetails.user_id === this.userID;
      if (result && isSameUserLoggedin) {
        this.licenseAvailabilityForFormAndRequestPerOrg(orgDetails);
        return true;
      } else {
        return false;
      }
    }
  }

  goto(link: any, id?: any) {
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
      this.router.navigate([link.routerLink || link, id]);
    } else {
      if (this.checkLinkAccess(link.routerLink || link)) {
        if (this.selectedOrgProperties.length > 0) {
          this.router.navigate([link.routerLink || link]);
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
      this.router.navigate([link.routerLink || link]);
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
      if (menu.icon !== undefined) {
        this.activateSublink(menu);
      }
    } else {
      this.isBillingActivelinkMatched = false;
      this.openNav();
    }
  }

  activateSublink(selectedItem): boolean {
    return this.isSublinkActive = this.selectedSubmenu.some((t) => t.showlink === selectedItem.showlink && t.icon === selectedItem.icon);
  }

  activateSublinkConsentPreference(selectedItem): boolean {
    return this.isSublinkActive = this.selectedSubmenu.some((t) => t === selectedItem.routerLink);
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
    return item.replace(/&amp;/g, '&');
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

  licenseAvailabilityForProperty(prop){
    this.dataService.checkLicenseAvailabilityForProperty(prop).subscribe(result => {
      this.dataService.setPropertyPlanToLocalStorage(result[0]);
      this.onCheckSubscriptionForProperty();
      this.onCheckConsentPreferenceSubscription();
    },(error)=>{
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
      if(resData.response && resData.response.plan_details &&  resData.response.plan_details.consentPreference){
        if(Object.values(resData.response.plan_details.consentPreference).length > 0){
          this.dataService.isConsentPreferenceApplied.next({ requesttype: 'consentpreference', hasaccess: true })
        }else{
          this.dataService.isConsentPreferenceApplied.next({ requesttype: 'consentpreference', hasaccess: false });
         // this.dataService.openUpgradeModalForConsentPreference(resData);
        }
      }
      if(resData.response && resData.response.plan_details &&  resData.response.plan_details.cookieConsent){
        if(Object.values(resData.response.plan_details.cookieConsent).length > 0){
          this.isShowDashboardForCookieConsent = true;
          this.dataService.isLicenseAppliedForProperty.next({ requesttype: 'property', hasaccess: true });
        }else{
          this.dataService.isLicenseAppliedForProperty.next({ requesttype: 'property', hasaccess: false });
          this.isShowDashboardForCookieConsent = false;
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

  checkForUpgradeDSAR(){
    let orglicenseStatus;
    this.planDetails = this.dataService.getCurrentOrganizationPlanDetails();
    this.dataService.isLicenseApplied.subscribe((status) => {
      orglicenseStatus = status.hasaccess;
    });
    if(!orglicenseStatus){
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
}
