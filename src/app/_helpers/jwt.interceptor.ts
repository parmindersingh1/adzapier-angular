import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from './../_services';
//import { debug } from 'util';
import { User } from '../_models';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
         //debugger;
        // headers: {
        //     Authorization:  `Bearer this.authenticationService.currentUserValue.token`;
        //   }
        let currentUser = this.authenticationService.currentUserValue;
        var t=this.authenticationService.currentUserValue;

    var headers_object = new HttpHeaders();
        headers_object.append('Content-Type', 'application/json');
        headers_object.append("Authorization", "Bearer " + t);

        const httpOptions = {
          headers: headers_object
        };
 
        if (currentUser && t) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${t}`
                }
            });
        }

        return next.handle(request);
    }
}