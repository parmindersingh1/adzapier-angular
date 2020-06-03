﻿import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { environment } from './../../environments/environment.develop';
import { User } from './../_models';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    public userLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    get isUserLoggedIn() {
        return this.userLoggedIn.asObservable();
    }
    public currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient, private router: Router) {

        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }

    login(email, password) {
        return this.http.post<any>(environment.apiUrl + '/login', { email, password })
            .pipe(map(user => {
              alert(user);
                if (user) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
                return user;
            }),
             catchError(err => {
                console.error(err.message, 'err');
                return throwError("Error thrown from catchError");
            }));
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    changePassword(requestObj) {
        return this.http.post<any>(environment.apiUrl + '/password/change', requestObj);
    }
}
