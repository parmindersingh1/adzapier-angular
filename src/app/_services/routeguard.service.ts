import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { DataService } from '../_services/data.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RouteguardService implements CanActivate {

  constructor(private dataService: DataService, private authenticationService: AuthenticationService) { }

  canActivate(): boolean {
    const currentUser = this.authenticationService.currentUserValue;
    let isPropertyCreated;
    this.dataService.OrganizationCreatedStatus.subscribe((status) => {
      isPropertyCreated = status;
    });
    if (currentUser) {
      const checkStatusOnPageRefresh = this.dataService.getOrganizationPropertyCreationStatus();
      if (!isPropertyCreated && checkStatusOnPageRefresh) { 
        return true;
      }
      if (isPropertyCreated) {
        return true;
      }
    } else {
      return false
    }


  }

}
