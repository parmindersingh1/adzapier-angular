import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { DataService } from './data.service';
@Injectable({
    providedIn: 'root'
})
export class LicenseGuardConsentPreferenceService implements CanActivate {

    constructor(private dataService: DataService) { }

    canActivate(): boolean {
        let consentPrefrenceForProperty;

        this.dataService.isConsentPreferenceAppliedForProperty.subscribe((status) => {
            consentPrefrenceForProperty = status;
        });
        if (consentPrefrenceForProperty.hasaccess){
            return true;
        }else{
            return false;
        }

    }

}
