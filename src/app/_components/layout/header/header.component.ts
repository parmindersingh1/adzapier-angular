import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganizationService, AuthenticationService, UserService } from '../../../_services';
import { Observable } from 'rxjs';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { Organization } from 'src/app/_models/organization';
import { mergeMap, switchMap, distinctUntilKeyChanged, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class HeaderComponent implements  OnInit {
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
  orgId:any;
  orgPropertyMenu: any;
  userID: any;
  propList: any;
  isOrganizationUpdated: boolean;
  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private orgservice: OrganizationService,
    private authService: AuthenticationService,
    private userService: UserService
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
  }


  ngOnInit() {
    //  this.firstElement = true;
    this.isCollapsed = false;
    this.userService.getCurrentUser.subscribe((data) => {
      if (data) {
        console.log(data, 'userService..');
        this.currentUser = data;
        this.isCollapsed = false;
        this.currentLoggedInUser = this.currentUser.response.firstname + ' ' + this.currentUser.response.lastname;
        this.userRole = this.currentUser.response.role;
        this.userID = this.currentUser.response.uid;
        console.log(this.userRole,'userRole...');
        this.loadOrganizationWithProperty();

      }
    });
   // this.getLoggedInUserDetails();
    this.orgservice.emitUpdatedOrgList.subscribe((data) => {
      this.loadOrganizationList();
    });
    // this.navigationMenu = [{
    //   'showlink': 'Application',
    //   'subcategory': [{ 'showlink': 'CCPA', 'routerLink': '/' }, { 'showlink': 'DSAR', 'routerLink': '/' }]
    // }];
    this.authService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser) {
      this.isCollapsed = false;
      this.getLoggedInUserDetails();
     // this.loadCurrentUser();
     // this.loadOrganizationList();
      this.currentSelectedProperty();
     // this.loadOrganizationWithProperty();
    //   this.orgservice.emitUpdatedOrganization.subscribe((data) => {
    //     this.currentOrganization = data.response.orgname;
    //     console.log(this.currentOrganization, 'currentOrganization..');
    //  });

    }
    this.publicNavigationMenu = [
      {
        showlink: 'Solutions',
        subcategory: [{ showlink: 'CCPA', routerLink: '/ccpa' }, { showlink: 'GDPR', routerLink: '/gdpr' }]
      }, {
        showlink: 'Pricing', routerLink: '/pricing'
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
    return this.router.navigate(['/user/profile/edit']);
  }

  isHeaderVisibleTop(): boolean {
    this.userService.currentregSubject.subscribe((data) => {
      if (data) {
        console.log(data, 'data..');
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
    console.log(this.headerStatus, 'header comp headerStatus.sss1.');
    return this.headerStatus;

  }

  loadOrganizationList() {
    this.orgservice.orglist().subscribe((data) => {
      if (data === null) {
        this.router.navigate(['/organizations']);
      }
      this.orgList = Object.values(data)[1];
      this.leftItems = this.orgList;


      console.log(this.leftItems, 'leftItems..');
    //  this.loadOrganizationProperty();
      //  else {
      //   this.orgList = Object.values(data)[0];
      //   this.leftItems = this.orgList;
      //   console.log(this.leftItems,'leftItems..');
      //  }

      // if (this.orgList[0] !== undefined) {
      //   const obj = {
      //     orgId: this.orgList[0].orgid,
      //     property: this.orgList[0].property[0]
      //   };
      //   this.orgservice.changeCurrentSelectedProperty(obj);
      this.currentSelectedProperty();
      // } else {

      // }

      this.rightItems = [
        {
          label: 'User', icon: 'assets/imgs/glass.jpg',
          items: [
            { label: 'User Preferences', routerLink: '/user/profile/edit', icon: 'edit-3' },
            { label: 'Organizations', routerLink: '/organizations', icon: 'activity' },
            { label: 'Billing', routerLink: '/pagenotfound', icon: 'credit-card' },
            { label: 'Settings', routerLink: '/settings', icon: 'settings' },
            { label: 'Help Center', routerLink: '/pagenotfound', icon: 'help-circle' },
            { label: 'Signout', routerLink: '/login', icon: 'log-out' }
          ]
        }];
      this.navigationMenu = [
        {
          showlink: 'Dashboard',
          subcategory: [{ showlink: 'CCPA DSAR', routerLink: '/dsarform', icon: 'bar-chart-2' },
          { showlink: 'GDPR', routerLink: '/pagenotfound', icon: 'pie-chart' },
          { showlink: 'Cookie Consent', routerLink: '/pagenotfound', icon: 'fas fa-cookie feather-16' }
          ]
        }, {
          showlink: 'Privacy',
          subcategory: [
            { showlink: 'Dashboard', routerLink: '/pagenotfound', icon: 'bar-chart-2' },
            { showlink: 'Webforms', routerLink: '/webforms', icon: 'pie-chart' },
            { showlink: 'Requests', routerLink: '/dsar-requests', icon: 'fa fa-ticket-alt feather-16' },
            { showlink: 'Work flow', routerLink: '/pagenotfound', icon: 'shield-off' },
            { showlink: 'Cookie Category', routerLink: '/pagenotfound', icon: 'fab fa-microsoft feather-16' },
            { showlink: 'Cookie Banner', routerLink: '/pagenotfound', icon: 'fas fa-cookie feather-16' },
            { showlink: 'Consent Tracking', routerLink: '/pagenotfound', icon: 'fas fa-file-contract feather-16' },
            { showlink: 'Setup', routerLink: '/pagenotfound', icon: 'fas fa-wrench feather-16' }
          ]
        }, { showlink: 'Billing', routerLink: '/billing' }];
    });



  }

  // loadOrganizationProperty(): any {
  //   this.orgList.forEach(element => {
  //     if(element.id !== '') {
  //       this.orgservice.getPropertyList(element.id);
  //     }
  //   }).subscribe((data) => {
  //     console.log(data, 'datapropertyList..');
  //     this.propertyList = data;
  //   });

  // }

  getLoggedInUserDetails() {
    this.isCollapsed = false;
    this.userService.getLoggedInUserDetails().subscribe((data) => {
      this.currentUser = data;
      this.currentLoggedInUser = this.currentUser.response.firstname + ' ' + this.currentUser.response.lastname;
      this.userRole = this.currentUser.response.role;
      this.userID = this.currentUser.response.uid;
    });
  }

  isCurrentPropertySelected(org, prop) {
    console.log(org,'org..');
    console.log(prop,'prop..');
    this.orgservice.getPropertyList(org.id).subscribe((data) => this.propList = data.response);
    console.log(this.checkPropertyStatus(prop),'cps..');
    if (this.checkPropertyStatus(prop)) {
      alert(prop.property_name + ' property has been disabled.');
    } else {
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
      // this.orgservice.getSelectedOrgProperty.emit(obj);
      //  this.firstElement = false;
      this.selectedOrgProperties.push(obj);
      this.orgservice.setCurrentOrgWithProperty(obj);
      this.currentSelectedProperty();

    }

    // this.router.navigate(['/webforms']);
  }

  isPropSelected(selectedItem): boolean {
    return this.selectedOrgProperties.filter((t) => t.property_id === selectedItem.property_id).length > 0;
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
    this.orgservice.getOrganizationWithProperty().subscribe((data)=>{
      this.orgPropertyMenu = data.response;
    } );
  }

  checkPropertyStatus(prop): boolean {
    if (this.propList) {
      return this.propList.filter((t) =>  t.id === prop.property_id && t.active === false).length > 0;
    }
  }

  loadOrgPropertyFromLocal() {
    const orgDetails = this.orgservice.getCurrentOrgWithProperty();
    if (orgDetails !== undefined) {
      if (orgDetails.user_id === this.userID) {
          this.currentOrganization = orgDetails.organization_name ? orgDetails.organization_name : orgDetails.response.orgname;
          this.currentProperty = orgDetails.property_name;
          this.selectedOrgProperties.push(orgDetails);
          this.isPropSelected(orgDetails);
      }
    }
    console.log(this.currentProperty,'currentProperty.last..');
    return this.currentProperty;
  }

}
