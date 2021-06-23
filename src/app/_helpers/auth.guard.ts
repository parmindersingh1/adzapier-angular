﻿import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './../_services';
import { DataService } from '../_services/data.service';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authenticationService: AuthenticationService,
                private dataService:DataService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        let url: string = state.url;
        this.dataService.checkClickedURL.next(state.url);
        this.authenticationService.redirectUrl = url;        
        if (currentUser) {
            // authorised so return true
            return true;
        }
        this.router.navigate(['/login']);
        // not logged in so redirect to login page with the return url
        return false;
    }
}
