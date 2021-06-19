import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from './../_services';
import {DataService} from '../_services/data.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,
                private dataService: DataService,
                private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
          if(err.status === 403) {
            this.dataService.openUnAuthModal.next({isTrue: true, error: err})
          }
            if (err.status === 401) {
              this.router.navigate(['/error/unauthorized']);
              // auto logout if 401 response returned from api
              this.authenticationService.logout();
              this.router.navigate(['/login']);
              // location.reload();
            }
            if(err.status === 403){
              this.router.navigate(['/error/forbidden']);
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
