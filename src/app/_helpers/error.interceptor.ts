import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from './../_services';
import {DataService} from '../_services/data.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    //let errorMsgKey = ["User is not authorized to access this functionality"]
    constructor(private authenticationService: AuthenticationService,
                private dataService: DataService,
                private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
          if(err.status === 403) {
            this.dataService.openUnAuthModal.next({isTrue: true, error: err})
          }
          if (err.status === 401) {
              // auto logout if 401 response returned from api
              if(err.url.indexOf('/api/v1/login') == -1 && err.error.error.match("exist.") == -1 || err.url.indexOf('/api/v1/login') == -1 && err.error.error.match("Incorrect") == -1){//
                this.authenticationService.logout();
                this.router.navigate(['/error/unauthorized']);
              }
              // location.reload();
            }
            if(err.status === 403){
              if(err.error.error.search("is not authorized") == -1){
              this.router.navigate(['/error/forbidden']);
              }
            }
            if(err.status === 404){
              this.router.navigate(['/error/pagenotfound']);
            }
            if(err.status === 500 || err.status === 501){
              this.router.navigate(['/error/servererror']);
            }
            const error = err.error.error || err.statusText;
            return throwError(error);
        }));
    }
}
