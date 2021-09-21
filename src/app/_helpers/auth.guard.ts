import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './../_services';
import { DataService } from '../_services/data.service';
import { Location } from '@angular/common';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authenticationService: AuthenticationService,
                private location:Location,
                private dataService:DataService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let id = this.getUrlParameterByName('id', window.location.href);
        console.log(id,'di..');
        const currentUser = this.authenticationService.currentUserValue;
        let url: string = state.url;
        this.dataService.checkClickedURL.next(state.url);
        this.authenticationService.redirectUrl = url;  
      //  if (this.location.path().indexOf('signup') == -1) {
            if (currentUser) {
                // authorised so return true
                return true;
            }else{
                this.router.navigate(['/login']);
                // not logged in so redirect to login page with the return url
                return false;
            }
        // } else {
        //     this.authenticationService.logout();
        //     localStorage.removeItem('currentUser');
        //     localStorage.clear();
        //     const a = this.location.path().split("?id=");
        //     this.router.navigate([a[0]], { queryParams: { id: a[1] } });
        // }
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
