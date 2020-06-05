import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from './_services';
import { User } from './_models';
import { HeaderComponent } from './_components/layout/header/header.component';
import { Router, NavigationEnd } from '@angular/router';
import * as feather from 'feather-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
        console.log(event.url.indexOf('editwebforms') === 0, 'editweb..');
        console.log(event.url.indexOf('editwebforms'), 'editwebindex..');
        console.log(event.url, 'editweburl..');
        this.hideHeaderFooter = (event.url.indexOf('/editwebforms') === -1);
      }
    });
    feather.replace();
  }
  // ngAfterViewInit(){
  //   this.headerComponent.loadOrganizationList();
  // }
}
