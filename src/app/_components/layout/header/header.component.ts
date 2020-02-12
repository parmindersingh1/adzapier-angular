import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  accessHeader:Boolean=false;
  dashname:string;
  userData:any;
  constructor(
      private router:Router,
      private activatedroute:ActivatedRoute,
  ) { }



  ngOnInit() {
    if ("currentUser" in localStorage) {
      this.accessHeader = true;
      this.userData = JSON.parse(localStorage.getItem('currentUser'));
      this.dashname = this.userData['name'];
      
    }  
  }

  logout(){
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
        
  }

}
