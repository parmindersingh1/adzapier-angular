import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { environment } from './../../environments/environment';
import { User } from './../_models';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import {LokiService} from './loki.service';
import {LokiFunctionality, LokiStatusType} from '../_constant/loki.constant';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    public userLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    get isUserLoggedIn() {
        return this.userLoggedIn.asObservable();
    }
    public currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient, private router: Router, private lokiService: LokiService) {

        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }

    login(componentName, moduleName, email, password) {
        const path = '/login';
        return this.http.post<any>(environment.apiUrl + path, { email, password })
            .pipe(map(user => {
                if (user) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
                return user;
            }),
            catchError(error => {
                this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.loginUser, componentName, moduleName, path);
                return throwError(error);
              })
             );
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    changePassword(componentName, moduleName, requestObj) {
        const path = '/password/change';
        return this.http.post<any>(environment.apiUrl + path, requestObj).pipe(
            catchError(error => {
                this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.changePassword, componentName, moduleName, path);
                return throwError(error);
              })
        );
    }

    onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
        this.lokiService.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
      }
}
