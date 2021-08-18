import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Location } from '@angular/common';
import { findPropertyIDFromUrl } from '../_helpers/common-utility';
import { DataService } from '../_services/data.service';

@Injectable({
  providedIn: 'root'
})
export class LicenseguardPropertyService implements CanActivate {

  constructor(private dataService: DataService,
    private router: Router,
    private location: Location) { }

  async canActivate(): Promise<boolean> {
    let licenseStatusForProperty;
    // on page refresh
    let propPlandetails = JSON.stringify(this.dataService.getCurrentPropertyPlanDetails()); // on page refresh
    let ispropplanExist;
    if (JSON.parse(propPlandetails).response && JSON.parse(propPlandetails).response.plan_details && JSON.parse(propPlandetails).response.plan_details.cookieConsent) {
      if (Object.values(JSON.parse(propPlandetails).response.plan_details.cookieConsent).length > 0) {
        ispropplanExist = true;
      }
    }
    this.dataService.isLicenseAppliedForProperty.subscribe((status) => {
      licenseStatusForProperty = status.hasaccess;
    });

    if (licenseStatusForProperty || ispropplanExist) {
      return true;
    } else {
      let oIDPIDFromURL = findPropertyIDFromUrl(this.location.path())
      if (oIDPIDFromURL !== undefined) {
        let results = await this.dataService.checkLicenseAvailabilityForProperty(oIDPIDFromURL[1]).toPromise();

        if (results.length > 0) {
          let finalObj = {
            ...results[0].response
          }
          if (finalObj !== null && Object.keys(finalObj).length !== 0) {
            if (finalObj !== undefined && finalObj.plan_details && finalObj.plan_details.cookieConsent) {
              if (Object.values(finalObj.plan_details.cookieConsent).length > 0) {
                return true;
              } else {
                this.dataService.openUpgradeModalForCookieConsent(results[0])
                this.router.navigate(['/home/dashboard/analytics'], { queryParams: { oid: oIDPIDFromURL[0], pid: oIDPIDFromURL[1] }, skipLocationChange: false });
                return false;
              }
            }
          }

        } else {
          this.dataService.openUpgradeModalForCookieConsent(results[0])
          this.router.navigate(['/home/dashboard/analytics'], { queryParams: { oid: oIDPIDFromURL[0], pid: oIDPIDFromURL[1] }, skipLocationChange: false });
          return false;
        }
      }
    }

  }

}