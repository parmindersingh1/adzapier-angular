import {Component, OnInit, ViewChild} from '@angular/core';
import {faCoffee} from '@fortawesome/free-solid-svg-icons';
import {AuthenticationService, OrganizationService} from './_services';
import {NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterEvent} from '@angular/router';
import * as feather from 'feather-icons';
import {CCPAFormConfigurationService} from './_services/ccpaform-configuration.service';
import {DsarformService} from './_services/dsarform.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {DataService} from './_services/data.service';
import {moduleName} from './_constant/module-name.constant';
import {BillingService} from './_services/billing.service';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // encapsulation: ViewEncapsulation.None

})
export class AppComponent implements OnInit {
  modalRef: BsModalRef;
  @ViewChild('unauth', {static: true}) unauth: any;
  title = 'adzapier-analytics-ng';
  faCoffee = faCoffee;
  allPlanData: any;
  hideHeaderFooter = true;
  public unAuthMsg: any;
  isShowingRouteLoadIndicator: boolean;

  constructor(private router: Router,
              private modalService: BsModalService,
              private billingService: BillingService,
              private authenticationService: AuthenticationService,
              private ccpaFormConfigurationService: CCPAFormConfigurationService,
              private dsarformService: DsarformService,
              private dataService: DataService,
              private organizationService: OrganizationService
  ) {
    //  this.headerComponent.loadOrganizationList();
    // Lazy Loading indicator
    this.isShowingRouteLoadIndicator = false;
    router.events.subscribe(
      (event: RouterEvent): void => {
        if (event instanceof RouteConfigLoadStart) {
          this.isShowingRouteLoadIndicator = true;
        } else if (event instanceof RouteConfigLoadEnd) {
          this.isShowingRouteLoadIndicator = false;
        }
      }
    );
  }

  ngOnInit() {
    this.onInitCPSDK();
    this.openUnAuthModal();
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

  onInitCPSDK() {
    const  js = document.createElement('script');
    js.type = 'text/javascript';
    js.src = environment.consentPreferenceCDN;

    document.body.appendChild(js);
  }
  private openUnAuthModal() {
    this.dataService.unAuthPopUp.subscribe((res: any) => {
      if (res.isTrue) {
        this.unAuthMsg = res.error.error;
        this.openUnAuthPopUp()
      }
    })
  }

  openUnAuthPopUp() {
    this.modalRef = this.modalService.show(this.unauth, {class: 'modal-sm'});
  }

}
