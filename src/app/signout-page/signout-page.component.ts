import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, UserService } from '../_services';

@Component({
  selector: 'app-signout-page',
  templateUrl: './signout-page.component.html',
  styleUrls: ['./signout-page.component.scss']
})
export class SignoutPageComponent implements OnInit {
  isCollapsed: true;

  constructor( private authService: AuthenticationService,
    private userService: UserService,
    private router: Router,


    ) { }

  ngOnInit() {
    this.logouts();
  }

  logouts() {
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


