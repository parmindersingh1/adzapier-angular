import { Component, OnInit } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from './_services';
import { User } from './_models';
import { HeaderComponent } from './_components/layout/header/header.component';
import { Router, NavigationEnd } from '@angular/router';
import * as feather from 'feather-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // encapsulation: ViewEncapsulation.None

})
export class AppComponent implements OnInit {

  title = 'adzapier-analytics-ng';
  faCoffee = faCoffee;
  hideHeaderFooter = true;
  constructor(private router: Router) {
  //  this.headerComponent.loadOrganizationList();
  }

  ngOnInit() {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.hideHeaderFooter = (event.url.indexOf('/editwebforms') === -1);
      }
    });
    feather.replace();
  }
  // ngAfterViewInit(){
  //   this.headerComponent.loadOrganizationList();
  // }
}
