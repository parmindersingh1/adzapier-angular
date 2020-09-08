import {Component, OnInit} from '@angular/core';
import {DashboardService} from '../../_services/dashboard.service';
import { OrganizationService} from '../../_services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {NotificationsService} from 'angular2-notifications';
import {notificationConfig} from '../../_constant/notification.constant';

declare var jQuery: any;
class CookieCount {
  totalConsent = 0;
  acceptAll = 0;
  saveSetting = 0;
  rejectAll = 0;
  close = 0;
  doNotSale = 0;
}
@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent implements OnInit {
  currentManagedOrgID: any;
  alertMsg: any;
  alertType: any;
  dismissible = true;
  isOpen = false;
  currrentManagedPropID: any;
  dashboardCount: CookieCount = new CookieCount();
  percentDashboardCount: CookieCount = new CookieCount();
  constructor(private dashboardService: DashboardService,
              private orgservice: OrganizationService,
              private notification: NotificationsService,
              private loading: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.onMapInIt();
    this.alertMsg = "adssa";
    this.isOpen = true;
    this.alertType = 'danger';
    this.onGetPropsAndOrgId();
    this.onGetDashboardData();
  }

  onGetPropsAndOrgId() {
    this.orgservice.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.currentManagedOrgID = response.organization_id;
        this.currrentManagedPropID = response.property_id;
      } else {
        const orgDetails = this.orgservice.getCurrentOrgWithProperty();
        this.currentManagedOrgID = orgDetails.organization_id;
        this.currrentManagedPropID = orgDetails.property_id;
      }
    });
  }
  onGetDashboardData() {
    this.loading.start('1');
    this.dashboardService.getDashboardData('dbb7e602-c70d-4692-ae6d-d92d3016501d')
      .subscribe(res => {
        this.loading.stop('1');
        if (res['status'] === 200) {
            const result = res['response'];
            // count
            this.dashboardCount.totalConsent =  result.hasOwnProperty('total_consents') ? result['total_consents'] :  0;
            this.dashboardCount.acceptAll =  result.hasOwnProperty('accept_all') ? result['accept_all'] :  0;
            this.dashboardCount.close =  result.hasOwnProperty('close') ? result['close'] :  0;
            this.dashboardCount.rejectAll =  result.hasOwnProperty('reject_all') ? result['reject_all'] :  0;
            this.dashboardCount.saveSetting =  result.hasOwnProperty('save_setting') ? result['save_setting'] :  0;
            this.dashboardCount.doNotSale = result.hasOwnProperty('do_not_sell') ? result['do_not_sell'] : 0;

            // Calculate Count
          this.percentDashboardCount.acceptAll =  result.hasOwnProperty('accept_all') ? this.onCalculateValue(result['accept_all']) :  0;
          this.percentDashboardCount.close =  result.hasOwnProperty('close') ? this.onCalculateValue(result['close']) :  0;
          this.percentDashboardCount.rejectAll =  result.hasOwnProperty('reject_all') ? this.onCalculateValue(result['reject_all']) :  0;
          this.percentDashboardCount.saveSetting =  result.hasOwnProperty('save_setting') ? this.onCalculateValue(result['save_setting']) :  0;
          this.percentDashboardCount.doNotSale = result.hasOwnProperty('do_not_sell') ? this.onCalculateValue(result['do_not_sell']) : 0;
        }
      }, error => {
        this.loading.stop('1');
       // this.notification.error('Cookie Consent Dashboard',  error, notificationConfig);
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
      });
  }

  onCalculateValue(val1) {
    return val1 * 100 / this.dashboardCount.totalConsent;
  }
  onMapInIt() {
    jQuery('#vmapUSA').vectorMap({
      map: 'world_en',
      showTooltip: true,
      backgroundColor: '#fff',
      color: '#d1e6fa',
      colors: {
        fl: '#69b2f8',
        ca: '#69b2f8',
        tx: '#69b2f8',
        wy: '#69b2f8',
        ny: '#69b2f8'
      },
      selectedColor: '#00cccc',
      enableZoom: false,
      borderWidth: 1,
      borderColor: '#fff',
      hoverOpacity: .85,
      onLabelShow: function (event, label, code) {
        if(code === 'us') {
          label.text();
        }
      }
    });
  }
  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }


}
