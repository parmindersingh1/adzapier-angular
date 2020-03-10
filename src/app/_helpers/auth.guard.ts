import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from './../_services';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.authenticationService.userLoggedIn.pipe(
            take(1),
            map((userLoggedIn: boolean) => {
                if (!userLoggedIn) {
                    this.router.navigate(['/login']);
                    return false;
                }
                return true;
            })
        );
    }
}
