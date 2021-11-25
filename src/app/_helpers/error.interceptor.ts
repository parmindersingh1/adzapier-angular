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
          if (err.status === 400) {
            // auto logout if 401 response returned from api
            if(err.url.indexOf('api/v1/invite/user/company') !== -1 && err.error.error.match("exist.") !== -1 || err.url.indexOf('/api/v1/login') == -1 && err.error.error.match("Incorrect") !== -1){//
              this.authenticationService.logout();
              this.dataService.openUnAuthModal.next({isTrue: true, error: err})
              this.router.navigate(['/error/unauthorized']);
            }else if(err.url.indexOf('api/v1/password/forgot') !== -1 || err.url.indexOf('api/v1/register/checkemailverify') !== -1){
              this.authenticationService.logout();
              const error = err.error.error || err.statusText;
              return throwError(error);
            }
            // location.reload();
          }
          if (err.status === 401) {
              // auto logout if 401 response returned from api
             // this.dataService.openUnAuthModal.next({isTrue: true, error: err})
              if(err.url.indexOf('/api/v1/login') == -1 && err.error.error.match("exist.") == -1 || err.url.indexOf('/api/v1/login') == -1 && err.error.error.match("Incorrect") == -1){//
                this.authenticationService.logout();
                this.router.navigate(['/error/unauthorized']);
                const error = err.error.error || err.statusText;
                return throwError(error);
              } else if(err.url.indexOf('/api/v1/login') !== -1){
                this.authenticationService.logout();
                const error = err.error.error || err.statusText;
                return throwError(error);
              }
              // location.reload();
            }
            if(err.status === 403){
              if(err.url.indexOf('/api/v1/invite/user/resend') !== -1){
                const error = err.error.error || err.statusText;
                return throwError(error);
              }else if(err.url.indexOf('/api/v1/billing/customerportal/session') !== -1){
                const error = err.error.error || err.statusText;
                return throwError(error);
              }
              else if(err.error.error.search("is not authorized") == -1){
              this.router.navigate(['/error/forbidden']);
              }
            }
            if(err.status === 404 || err.status === 401){
              if(err.url.indexOf('/api/v1/invite/user') !== -1){
                const error = err.error.error || err.statusText;
                this.dataService.openUnAuthModal.next({isTrue: true, error: err})
                return throwError(error);
              }else{
                this.router.navigate(['/error/pagenotfound']);
              }
            }
            if(err.status === 500 || err.status === 501){
              if(err.url.indexOf('/api/v1/register') !== -1){
                const error = err.error.error || err.statusText;
                return throwError(error);
              } else if(err.url.indexOf('/api/v1/password') !== -1){
                const error = err.error.error || err.statusText;
                return throwError(error);
              } else if(err.url.indexOf('/api/v1/workflow') !== -1){
                const error = err.error.error || err.statusText;
                return throwError(error);
              } else if(err.url.indexOf('/api/v1/organizations') !== -1){
                const error = err.error.error || err.statusText;
                return throwError(error);
              } else if(err.url.indexOf('/api/v1/email/verify') !== -1){
                const error = err.error.error || err.statusText;
                return throwError(error);
              } else if(err.url.indexOf('/api/v1/user/verifyemail') !== -1){
                const error = err.error.error || err.statusText;
                return throwError(error);
              } else if(err.url.indexOf('/billing/checkout/trialsession') !== -1){
                const error = err.error.error || err.statusText;
                return throwError(error);
              } else{
                this.router.navigate(['/error/servererror']);
              }
            }
            const error = err.error.error || err.statusText;
            return throwError(error);
        }));
    }
}
