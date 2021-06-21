import { Component, OnInit } from '@angular/core';

// import { df1 } from './sampledata';
import { faChrome, faEdge, faFirefox, faSafari, faOpera } from '@fortawesome/free-brands-svg-icons';
import { UserService, AuthenticationService, OrganizationService } from 'src/app/_services';
import { DataService } from '../_services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  faChrome = faChrome;
  faEdge = faEdge;
  faFirefox = faFirefox;
  faSafari = faSafari;
  faOpera = faOpera;
  loginToken;
  currentUser: any;
  isCollapsed: any;
  isLicenseAssignedtoProperty = false;
  isLicenseAssignedtoOrganization = false;
  isConsentPreferenceLicenseAssignedToProperty = false;
  dsarTooltiptext:string;
  consentTooltipText:string;
  cookieTooltiptext:string;
  constructor(
    private orgservice: OrganizationService,
    private userService: UserService,
    private authService: AuthenticationService,
    private dataService: DataService
  ) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
    this.isCollapsed = false;
   }
  // redirect to home if already logged in


  ngOnInit(){
   this.isPropertyLicenseAssigned();
   this.isOrganizationLicenseAssigned();
   this.isConsentPreferenceLicenseAssigned();
  }

  isPropertyLicenseAssigned():boolean {
    this.dataService.isLicenseAppliedForProperty.subscribe((status) =>  {
    this.isLicenseAssignedtoProperty = status.hasaccess;
    });
    this.cookieTooltiptext = this.isLicenseAssignedtoProperty ? '' : 'You have not assigned Cookie consent license to selected property';
    return this.isLicenseAssignedtoProperty;
  }

  isConsentPreferenceLicenseAssigned():boolean {
    this.dataService.isConsentPreferenceAppliedForProperty.subscribe((status) =>  {
    this.isConsentPreferenceLicenseAssignedToProperty = status.hasaccess;
    });
    this.consentTooltipText = this.isConsentPreferenceLicenseAssignedToProperty ? '' : 'You have not assigned Consent Preference to selected property';
    return this.isConsentPreferenceLicenseAssignedToProperty;
  }

  isOrganizationLicenseAssigned():boolean {
    let licenseStatus;
    this.dataService.isLicenseApplied.subscribe((status) =>  {
     licenseStatus = status.hasaccess;
     this.isLicenseAssignedtoOrganization = licenseStatus;
     this.dsarTooltiptext = this.isLicenseAssignedtoOrganization ? '' : 'You have not assigned DSAR license to selected organization';
    });
    return this.isLicenseAssignedtoOrganization = licenseStatus;
  }

}
