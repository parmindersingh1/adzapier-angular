import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganizationService, AuthenticationService, UserService } from '../../../_services';
import { User } from '../../../_models';
import { Observable } from 'rxjs';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { Organization } from 'src/app/_models/organization';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class HeaderComponent implements OnInit {
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
      }
    });
    this.orgservice.emitUpdatedOrgList.subscribe((data) => {
      this.loadOrganizationList();
    });
    this.navigationMenu = [{
      'showlink': 'Application',
      'subcategory': [{ 'showlink': 'CCPA', 'routerLink': '/dsarform' }, { 'showlink': 'DSAR', 'routerLink': '/dsarform' }]
    }];
    this.authService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser) {
      this.isCollapsed = false;
      this.getLoggedInUserDetails();
      this.loadOrganizationList();
    }
  }

  logout() {
    this.authService.logout();
    this.isCollapsed = true;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
    location.reload();

  }

  // getDynamicMenu() {
  //   const testNames = ['Test1', 'Test2', 'Test3'];
  //   const dynamicSubmenu = [];
  //   for (const menuName of testNames) {
  //     dynamicSubmenu.push({ label: 'Submenu - ' + menuName, routerLink: '/submenus/' + menuName.toLowerCase() });
  //   }
  //   return dynamicSubmenu;
  // }

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
      this.orgList = Object.values(data)[0];
      this.leftItems = this.orgList;
    //  this.orgservice.getSelectedOrgProperty.emit(this.orgList[0].property[0]);
    //  this.orgservice.getOrganization.emit(this.orgList[0].orgid);
      const obj = {
        orgId: this.orgList[0].orgid,
        property: this.orgList[0].property[0]
      };
      this.orgservice.changeCurrentSelectedProperty(obj);
      this.rightItems = [
        {
          label: 'User', icon: 'assets/imgs/glass.jpg',
          items: [
            { label: 'Edit Profile', routerLink: '/user/profile/edit', icon: 'fas fa-pen' },
            { label: 'Organization', routerLink: '/portalorg', icon: 'fas fa-sitemap' },
            { label: 'Help Center', routerLink: '/pagenotfound', icon: 'far fa-question-circle' },
            { label: 'Forum', routerLink: '/pagenotfound', icon: 'fas fa-tasks' },
            { label: 'Account Settings', routerLink: '/user/password/change-password', icon: 'fas fa-tools' },
            { label: 'Privacy Settings', routerLink: '/pagenotfound', icon: 'fas fa-user-cog' },
            { label: 'Signout', routerLink: '', icon: 'fas fa-sign-out-alt' }
          ]
        }];
      this.navigationMenu = [{
        showlink: 'Application',
        subcategory: [{showlink:'Web Forms', routerLink: '/webforms'},{ showlink: 'CCPA', routerLink: '/dsarform' }, { showlink: 'DSAR', routerLink: '/dsarform' }],
      }]

    });

    this.orgservice.emitUpdatedOrganization.subscribe((data) => {
      for (const key in data) {
        if (data[key].name !== undefined) {
          return this.currentOrganization = data[key].name;
        }
      }

    });
  }

  getLoggedInUserDetails() {
    this.isCollapsed = false;
    this.userService.getLoggedInUserDetails().subscribe((data) => {
      this.currentLoggedInUser = Object.values(data)[0].firstname + ' ' + Object.values(data)[0].lastname;
    });
  }

  isCurrentPropertySelected(item) {
    this.selectedOrgProperties.length = 0;
    this.activeProp = item.propName;
    const obj = {
      orgId: this.orgList[0].orgid,
      property: item
    };
    this.orgservice.changeCurrentSelectedProperty(obj);
   // this.orgservice.getSelectedOrgProperty.emit(obj);
  //  this.firstElement = false;
    this.selectedOrgProperties.push(item);
  }

  isPropSelected(selectedItem): boolean {
    return this.selectedOrgProperties.filter((t) => t.propName === selectedItem.propName).length > 0;
  }

  public trackByMethod(index: number): number {
   return index;
  }

  checkisCollapsed(): boolean {
    this.isCollapsed ? this.firstElement = true : this.firstElement = false;
    return this.isCollapsed = !this.isCollapsed;
  }
}
