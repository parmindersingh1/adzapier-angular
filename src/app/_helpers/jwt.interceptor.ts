import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from './../_services';
//import { debug } from 'util';
import { User } from '../_models';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const currentUser = this.authenticationService.currentUserValue;
        let headers_object = new HttpHeaders();
        headers_object.append('Content-Type', 'application/json');
        headers_object.append('Authorization', `Bearer` + currentUser);

        const httpOptions = {
            headers: headers_object
        };

        if (currentUser && currentUser["response"].token) {

            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser["response"].token}`
                }
            });
        }

        return next.handle(request);
    }
}