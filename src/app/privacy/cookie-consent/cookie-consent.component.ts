import { Component, OnInit } from '@angular/core';
import {CookieConsentService} from '../../_services/cookie-consent.service';
import {OrganizationService} from '../../_services';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentTableComponent implements OnInit {
  cookieConsents = [];
  private currentManagedOrgID: any;
  private currrentManagedPropID: any;
  totalCookieCount;
  private firstone: number;
  eventRows;
  tLoading = true;
  pagelimit;
  constructor(private cookieConsentService: CookieConsentService,
              private  orgservice: OrganizationService,
              private loading: NgxUiLoaderService,

  ) { }

  ngOnInit() {
    this.onGetPropsAndOrgId();
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
  onGetCookieConsentData(event) {
    this.tLoading = true;
    this.eventRows = event.rows;
    if (event.first === 0) {
      this.firstone = 1;
    } else {
      this.firstone = (event.first / event.rows) + 1;
    }
    this.pagelimit = '?limit=' + this.eventRows + '&page=' + this.firstone;
    this.cookieConsentService.getConsent(this.currrentManagedPropID, this.pagelimit, this.constructor.name)
        .subscribe(res => {
          this.tLoading = false;
          if (res['status'] === 200) {
            this.cookieConsents = Object.values(res['response']['CookieConsent']);
            this.totalCookieCount = res['count'];
          }
        }, error => {
          this.tLoading = false;
        });
  }
}
