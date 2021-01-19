import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './../_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authenticationService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        let url: string = state.url;
        this.authenticationService.redirectUrl = url;        
        if (currentUser) {
            // authorised so return true
            return true;
        } else {
            this.router.navigate(['/login']);
        }
        // let routeURL = url.substring(0, this.router.url.indexOf("?"));
        // console.log(routeURL,'url..');
        if(url.indexOf('/privacy') !== -1){
            this.router.navigate(['/login'],{queryParams:{'redirectURL':state.url}});    
        }else{
            this.router.navigate(['/login']);
        }
        // not logged in so redirect to login page with the return url
        return false;
    }
}
