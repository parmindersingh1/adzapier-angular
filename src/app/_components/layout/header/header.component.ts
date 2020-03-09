import { Component, OnInit, Input, Output, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Orglist } from 'src/app/_models';
import { OrganizationService, AuthenticationService, UserService } from '../../../_services';
import { User } from '../../../_models';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  accessHeader: boolean;
  public currentLoggedInUser: string;
  uid: string;
  userData: any;
  returnUrl: string;
  currentUser: any;
  isUserLoggedIn$: Observable<boolean>;
  token: any;
  loginToken: any;
  public isHeaderVisible: boolean;
  public headerStatus: boolean;
  @Input() loggedinUserDetails: User;
  orgList: any;
  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private orgservice: OrganizationService,
    private authService: AuthenticationService,
    private userService: UserService
  ) {  }



  ngOnInit() {
    // this.isHeaderVisibleTop();
    this.isUserLoggedIn$ = this.authService.isUserLoggedIn;
    this.userService.getCurrentUser.subscribe((data) => {
      this.currentUser = data;
      this.currentLoggedInUser = this.currentUser.response.firstname + ' ' + this.currentUser.response.lastname;
    });
    this.loadOrganizationList();
  }



  logout() {
    this.authService.logout();
    localStorage.removeItem('currentUser');
    //  this.authService.isloggedin = false;
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
    if (this.authService.currentUserValue) {
      this.orgservice.orglist().subscribe((data) => {
        this.orgList = Object.values(data)[0];
      });
    }
    return false;
  }

}
