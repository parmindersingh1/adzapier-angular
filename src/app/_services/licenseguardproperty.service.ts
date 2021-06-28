import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { DataService } from '../_services/data.service';

@Injectable({
    providedIn: 'root'
})
export class LicenseguardPropertyService implements CanActivate {

    constructor(private dataService: DataService) { }

    canActivate(): boolean {
        let licenseStatusForProperty;
      // on page refresh
        let propPlandetails = JSON.stringify(this.dataService.getCurrentPropertyPlanDetails()); // on page refresh
        let ispropplanExist;
        if(JSON.parse(propPlandetails).response && JSON.parse(propPlandetails).response.plan_details &&  JSON.parse(propPlandetails).response.plan_details.cookieConsent){
          if(Object.values(JSON.parse(propPlandetails).response.plan_details.cookieConsent).length > 0){
            ispropplanExist = true;
          }
        }
        this.dataService.isLicenseAppliedForProperty.subscribe((status) => {
            licenseStatusForProperty = status.hasaccess;
        });

        if (licenseStatusForProperty || ispropplanExist) {
            return true;
        } else {
            return false;
        }

    }

}

// canActivate(): boolean {
//     const currentUser = this.authenticationService.currentUserValue;
//     let isPropertyCreated;
//     this.dataService.OrganizationCreatedStatus.subscribe((status) => {
//       isPropertyCreated = status;
//     });
//     if (currentUser) {
//       const checkStatusOnPageRefresh = this.dataService.getOrganizationPropertyCreationStatus();
//       if (!isPropertyCreated && typeof checkStatusOnPageRefresh !== 'undefined' || !isPropertyCreated && checkStatusOnPageRefresh !== null) { 
//         return true;
//       }
//       if (isPropertyCreated) {
//         return true;
//       }
//     } else {
//       return false
//     }


//   }