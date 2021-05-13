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
    this.dataService.isLicenseApplied.subscribe((status) => {
      licenseStatus = status;
    });

    if (licenseStatus.hasaccess) {
      return true;
    } else {
      return false;
    }

  }

}
