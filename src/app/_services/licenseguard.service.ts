import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DataService } from '../_services/data.service';
import { Location } from '@angular/common';
import { findPropertyIDFromUrl } from '../_helpers/common-utility'
import { take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LicenseguardService implements CanActivate {

  constructor(private dataService: DataService,
    private router: Router, private location: Location) { }

  async canActivate(): Promise<boolean> {
    let licenseStatus;
    // on page refresh
    let orgPlandetails = JSON.stringify(this.dataService.getCurrentOrganizationPlanDetails());
    let isorgplanExist;
    if (JSON.parse(orgPlandetails).response && JSON.parse(orgPlandetails).response.plan_details && JSON.parse(orgPlandetails).response.plan_details.dsar) {
      if (Object.values(JSON.parse(orgPlandetails).response.plan_details.dsar).length > 0) {
        isorgplanExist = true;
      }
    }
    this.dataService.isLicenseApplied.pipe(take(1)).subscribe((status) => {
      licenseStatus = status;
    });

    if (licenseStatus.hasaccess || isorgplanExist) { 
      return true;
    } else {
      let oIDPIDFromURL = findPropertyIDFromUrl(this.location.path())
      if (oIDPIDFromURL !== undefined) {
        let results = await this.dataService.checkLicenseAvailabilityPerOrganization(oIDPIDFromURL[0]).toPromise();
        if (results.length !== 0) {
          let finalObj = {
            ...results[0].response,
            ...results[1].response,
            ...results[2].response
          }
          if (finalObj !== null && Object.keys(finalObj).length !== 0) {
            return true;
          } else {
            if (this.router.url.indexOf('/welcome') === -1) {
              this.router.navigate(['/home/dashboard/analytics'], { queryParams: { oid: oIDPIDFromURL[0], pid: oIDPIDFromURL[1] }, skipLocationChange: false });
              this.dataService.openUpgradeModalForDsar(results);
              return false;
            } else {
              return false;
            }
          }
        }
      }
    }

  }

}
