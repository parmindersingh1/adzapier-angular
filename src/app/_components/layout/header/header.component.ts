import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { OrganizationService, AuthenticationService, UserService } from '../../../_services';
import { Observable } from 'rxjs';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { Organization } from 'src/app/_models/organization';
import { mergeMap, switchMap, distinctUntilKeyChanged, distinctUntilChanged } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { moduleName } from 'src/app/_constant/module-name.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class HeaderComponent implements OnInit {
  @ViewChild('confirmTemplate', { static: false }) confirmModal: TemplateRef<any>;
  modalRef: BsModalRef;
  isCollapsed = true;
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
  close: boolean;
  userRole: string;
  propertyList: any;
  listOfProp: any;
  orgId: any;
  orgPropertyMenu: any;
  userID: any;
  propList: any;
  isOrganizationUpdated: boolean;
  isPropertySelected: boolean;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private orgservice: OrganizationService,
    private authService: AuthenticationService,
    private userService: UserService,
    private loading: NgxUiLoaderService,
    private bsmodalService: BsModalService
  ) {
    this.authService.currentUser.subscribe(x => {
      this.currentUser = x;
      if (this.currentUser) {
        this.isCollapsed = false;
        this.getLoggedInUserDetails();
        this.loadOrganizationList();
        this.loadOrganizationWithProperty();
      }
    });

    this.orgservice.isOrganizationUpdated.subscribe((t) => {
      this.isOrganizationUpdated = t;
      if (this.isOrganizationUpdated) {
        this.loadOrganizationWithProperty();
        this.currentSelectedProperty();
      }
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

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
        console.log(this.userRole, 'userRole...');
        this.loadOrganizationWithProperty();

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
    //this.loadPropertyByOrgID();
  }

  logout() {
    this.authService.logout();
    this.isCollapsed = true;
    localStorage.removeItem('currentUser');
    // this.orgservice.removeControls();
    // this.userService.getCurrentUser.unsubscribe();
    this.router.navigate(['/login']);
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
      if (data === null) {
        this.router.navigate(['settings/organizations']);
      }
      this.orgList = Object.values(data)[1];
      this.leftItems = this.orgList;
      this.currentSelectedProperty();
      this.rightItems = [
        {
          label: 'User', icon: 'assets/imgs/glass.jpg',
          items: [
            { label: 'User Preferences', routerLink: '/userprofile', icon: 'edit-3' },
            { label: 'Organizations', routerLink: 'settings/organizations', icon: 'activity' },
            { label: 'Billing', routerLink: 'settings/billing', icon: 'credit-card' },
            { label: 'Settings', routerLink: '/settings', icon: 'settings' },
            { label: 'Help Center', routerLink: '/pagenotfound', icon: 'help-circle' },
            { label: 'Signout', routerLink: '/login', icon: 'log-out' }
          ]
        }];
      this.navigationMenu = [
        {
          showlink: 'Dashboard',
          subcategory: [{ showlink: 'DSAR', routerLink: '/home/dashboard/ccpa-dsar', icon: 'bar-chart-2' },
          // { showlink: 'GDPR', routerLink: '/pagenotfound', icon: 'pie-chart' },
          { showlink: 'Cookie Consent', routerLink: '/home/dashboard/cookie-consent', icon: 'fas fa-cookie feather-16' }
          ]
        }, {
          showlink: 'Privacy',
          subcategory: [
            { showlink: 'Dashboard', routerLink: '/home/dashboard/ccpa-dsar', icon: 'bar-chart-2' },
            { showlink: 'Webforms', routerLink: '/privacy/dsar/webforms', icon: 'pie-chart' },
            { showlink: 'Requests', routerLink: '/privacy/dsar/dsar-requests', icon: 'fa fa-ticket-alt feather-16' },
            { showlink: 'Workflow', routerLink: '/privacy/dsar/workflows', icon: 'shield-off' },

            { showlink: 'Dashboard', routerLink: '/home/dashboard/cookie-consent', icon: 'fas fa-cookie feather-16' },
            { showlink: 'Cookie Category', routerLink: '/cookie-consent/cookie-category', icon: 'fab fa-microsoft feather-16' },
            { showlink: 'Cookie Banner', routerLink: '/cookie-consent/cookie-banner', icon: 'fas fa-cookie feather-16' },
            { showlink: 'Consent Tracking', routerLink: '/cookie-consent/cookie-tracking', icon: 'fas fa-file-contract feather-16' },
            { showlink: 'Setup', routerLink: '/cookie-consent/cookie-banner/setup', icon: 'fas fa-wrench feather-16' }
          ]
        }, { showlink: 'Billing', routerLink: 'settings/billing' }];
    }, (error) => {
      console.log(error);
    });



  }


  getLoggedInUserDetails() {
    this.isCollapsed = false;
    this.userService.getLoggedInUserDetails(this.constructor.name, moduleName.headerModule).subscribe((data) => {
      this.currentUser = data;
      this.currentLoggedInUser = this.currentUser.response.firstname + ' ' + this.currentUser.response.lastname;
      this.currentLoggedInUser = this.currentLoggedInUser.toLowerCase().split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
      this.userRole = this.currentUser.response.role;
      this.userID = this.currentUser.response.uid;
    });
  }

  isCurrentPropertySelected(org, prop) {
    this.selectedOrgProperties.length = 0;
    this.activeProp = prop.property_name;
    const obj = {
      organization_id: org.id,
      organization_name: org.orgname,
      property_id: prop.property_id,
      property_name: prop.property_name,
      user_id: this.userID
    };
    this.orgservice.changeCurrentSelectedProperty(obj);
    this.selectedOrgProperties.push(obj);
    this.orgservice.setCurrentOrgWithProperty(obj);
    this.currentSelectedProperty();
    if (this.router.url.indexOf('privacy/dsar/dsar-requests-details') !== -1) {
      this.router.navigate(['/privacy/dsar/dsar-requests']);
    } else {
      this.router.navigate([this.router.url]);
    }

  }

  isPropSelected(selectedItem): boolean {
    const propertySelected = this.selectedOrgProperties.filter((t) => t.property_id === selectedItem.property_id).length > 0;
    return this.isPropertySelected = propertySelected;
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
            this.selectedOrgProperties.push(data);
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
    this.close = true;
  }

  closeNav() {
    this.close = false;
  }

  loadOrganizationWithProperty() {
    this.loading.start();
    this.orgservice.getOrganizationWithProperty().subscribe((data) => {
      this.loading.stop();
      this.orgPropertyMenu = data.response;
      if (data.response.length > 0) {
        this.rearrangeFormSequence(this.orgPropertyMenu);
        this.selectedOrgProperties.length = 0;
        if (!this.isOrgPropertyExists(this.orgPropertyMenu)) {
          if (typeof this.orgPropertyMenu[0].property[0] === 'undefined') {
            // this.router.navigate(['settings/organizations']);
            this.router.navigate(['settings/organizations/details/' + this.orgPropertyMenu[0].id]);
            return false;
          } else {
            this.activeProp = this.orgPropertyMenu[0].property[0].property_name;
            const obj = {
              organization_id: this.orgPropertyMenu[0].id,
              organization_name: this.orgPropertyMenu[0].orgname,
              property_id: this.orgPropertyMenu[0].property[0].property_id,
              property_name: this.orgPropertyMenu[0].property[0].property_name,
              user_id: this.userID
            };
            this.orgservice.changeCurrentSelectedProperty(obj);
            // this.orgservice.getSelectedOrgProperty.emit(obj);
            //  this.firstElement = false;
            this.selectedOrgProperties.push(obj);
            this.orgservice.setCurrentOrgWithProperty(obj);
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
        this.selectedOrgProperties.push(orgDetails);
        this.isPropSelected(orgDetails);
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
        return true;
      } else {
        return false;
      }
    }
  }

  goto(link: any, id?: any) {
    if (id !== undefined) {
      this.router.navigate([link, id]);
    } else {
      if (link.indexOf('cookie') !== -1) {
        if (this.isPropertySelected) {
          this.router.navigate([link]);
        } else {
          this.openModal(this.confirmModal);
          return false;
        }
      } else {
        this.router.navigate([link]);
      }
    }
  }
 //  || link.indexOf('privacy') !== -1 || link.indexOf('webform') !== -1 || link.indexOf('ccpa') !== -1
  confirm() {
    this.modalRef.hide();
    this.router.navigate(['settings/organizations/details/' + this.orgPropertyMenu[0].id]);
    // return false;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.bsmodalService.show(template, { class: 'modal-sm' });
  }

}
