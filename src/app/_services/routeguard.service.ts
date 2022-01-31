import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { DataService } from '../_services/data.service';
import { AuthenticationService } from './authentication.service';
import { Location } from '@angular/common';
import { findPropertyIDFromUrl } from '../_helpers/common-utility'
import { take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RouteguardService implements CanActivate {

  constructor(private dataService: DataService, private authenticationService: AuthenticationService,
    private activatedRoute:ActivatedRoute,
    private location: Location,
    private router: Router) { }

  canActivate(): boolean {
    const currentUser = this.authenticationService.currentUserValue;
    let isPropertyCreated;
    this.dataService.OrganizationCreatedStatus.pipe(take(1)).subscribe((status) => {
      isPropertyCreated = status;
    });
    if (currentUser) {
      const checkStatusOnPageRefresh = this.dataService.getOrganizationPropertyCreationStatus();
      if (!isPropertyCreated && typeof checkStatusOnPageRefresh !== 'undefined' || !isPropertyCreated && checkStatusOnPageRefresh !== null) { 
        return true;
      }
      if (isPropertyCreated || checkStatusOnPageRefresh) {
        return true;
      }
    } else {
     //  let obj = findPropertyIDFromUrl(this.location.path())
      // this.router.navigate(['/home/dashboard/analytics'],{ queryParams: { oid: obj[0], pid: obj[1] },  skipLocationChange:false});
      return false
    }


  }

}
