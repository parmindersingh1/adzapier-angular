import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { findPropertyIDFromUrl } from '../_helpers/common-utility';
import { DataService } from './data.service';
import { Location } from '@angular/common';
@Injectable({
    providedIn: 'root'
})
export class LicenseGuardConsentPreferenceService implements CanActivate {

    constructor(private location: Location, private router: Router,private dataService: DataService) { }

    async canActivate(): Promise<boolean> {
        let consentPrefrenceForProperty;

        this.dataService.isConsentPreferenceAppliedForProperty.subscribe((status) => {
            consentPrefrenceForProperty = status;
        });
        if (consentPrefrenceForProperty.hasaccess){
            return true;
        } else {
            let oIDPIDFromURL = findPropertyIDFromUrl(this.location.path())
            let results = await this.dataService.checkLicenseAvailabilityForProperty(oIDPIDFromURL[0]).toPromise();
            if (results) {
                let finalObj = {
                    ...results[0].response
                }
                if (finalObj !== undefined && finalObj.plan_details && finalObj.plan_details) {
                    if (Object.values(finalObj.plan_details.consentPreference).length > 0) {
                      return true;
                    } else {
                      this.dataService.openUpgradeModalForConsentPreference(results[0])
                      this.router.navigate(['/home/dashboard/analytics'], { queryParams: { oid: oIDPIDFromURL[0], pid: oIDPIDFromURL[1] }, skipLocationChange: false });
                      return false;
                    }
                  }

                  // if (resData.response && resData.response.plan_details && resData.response.plan_details.consentPreference) {
  //   if (Object.values(resData.response.plan_details.consentPreference).length > 0) {
  //     this.dataService.isConsentPreferenceApplied.next({ requesttype: 'consentpreference', hasaccess: true })
  //   }
                // if (finalObj !== null && Object.keys(finalObj).length !== 0) {
                //     return true;
                // } else {
                //     return false;
                //     //this.router.navigate(['/home/dashboard/analytics'], { queryParams: { oid: oIDPIDFromURL[0], pid: oIDPIDFromURL[1] }, skipLocationChange: false });
                // }
            }
        }

    }

}
