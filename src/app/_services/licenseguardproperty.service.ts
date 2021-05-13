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
        this.dataService.isLicenseAppliedForProperty.subscribe((status) => {
            licenseStatusForProperty = status;
        });

        if (licenseStatusForProperty.hasaccess) {
            return true;
        } else {
            return false;
        }

    }

}
