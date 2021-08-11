import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './../_services';
import { DataService } from '../_services/data.service';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authenticationService: AuthenticationService,
                private dataService:DataService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let id = this.getUrlParameterByName('id', window.location.href);
        console.log(id,'di..');
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

    getUrlParameterByName(name: string, url?: any) {
        if (!url) { url = window.location.href; }
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(url);
        if (!results) { return null; }
        if (!results[2]) { return ''; }
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    
}
