import { Component, OnInit } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService, OrganizationService } from './_services';
import { User } from './_models';
import { HeaderComponent } from './_components/layout/header/header.component';
import { Router, NavigationEnd } from '@angular/router';
import * as feather from 'feather-icons';
import { CCPAFormConfigurationService } from './_services/ccpaform-configuration.service';
import { DsarformService } from './_services/dsarform.service';

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
  constructor(private router: Router, 
              private authenticationService: AuthenticationService,
              private ccpaFormConfigurationService: CCPAFormConfigurationService,
              private dsarformService: DsarformService,
              private organizationService: OrganizationService
  ) {
    //  this.headerComponent.loadOrganizationList();
  }

  ngOnInit() {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.indexOf('/resetpswd') !== -1 || event.url.indexOf('/verify-email') !== -1) {
          this.hideHeaderFooter = true;
          this.authenticationService.logout();
          this.ccpaFormConfigurationService.removeControls();
          this.dsarformService.removeControls();
          this.organizationService.removeControls();
        }

      }
    });
    feather.replace();
  }
  // ngAfterViewInit(){
  //   this.headerComponent.loadOrganizationList();
  // }
}
