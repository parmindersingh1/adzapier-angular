import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { DataService } from '../_services/data.service';

@Injectable({
  providedIn: 'root'
})
export class LicenseguardService implements CanActivate {

  constructor(private dataService: DataService) { }

  canActivate(): boolean {
    let licenseStatus;
   // on page refresh
    let orgPlandetails = JSON.stringify(this.dataService.getCurrentOrganizationPlanDetails()); 
    let isorgplanExist;
    if(JSON.parse(orgPlandetails).response && JSON.parse(orgPlandetails).response.plan_details &&  JSON.parse(orgPlandetails).response.plan_details.dsar){
      if(Object.values(JSON.parse(orgPlandetails).response.plan_details.dsar).length > 0){
        isorgplanExist = true;
      }
    }
    this.dataService.isLicenseApplied.subscribe((status) => {
      licenseStatus = status;
    });

    if (licenseStatus.hasaccess || isorgplanExist) {
      return true;
    } else {
      return false;
    }

  }

}
