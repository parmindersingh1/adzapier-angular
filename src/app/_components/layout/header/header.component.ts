import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Orglist } from 'src/app/_models';
import { OrganizationService, AuthenticationService } from '../../../_services';
import { User } from '../../../_models';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  accessHeader:Boolean=false;
  dashname:string;
  uid:string;
  userData:any;
  returnUrl : string;
  
  
  // authService:AuthenticationService;

  constructor(
      private router:Router,
      private activatedroute:ActivatedRoute,
      private orgservice:OrganizationService,
      private authService: AuthenticationService,
  ) {
    
   }



  ngOnInit() {
    this.accessHeader = this.authService.isloggedin;
    let url = window.location.href;
    if ("currentUser" in localStorage) {
      this.accessHeader = true;
      this.userData = JSON.parse(localStorage.getItem('currentUser'));
      this.dashname = this.userData['name'];
      
     
    }  
     
    if (url.includes("signup") || url.includes("login")) {
      this.accessHeader = false;
    }
    
  }
  
    
    
  logout(){
   // alert("logout");
    localStorage.removeItem('currentUser');
    this.authService.updateLoginStatus(false);
    this.router.navigate(['/login']);
    location.reload();
        
  }

}
