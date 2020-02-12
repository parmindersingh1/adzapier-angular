﻿import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment.staging';
import { User } from './../_models';
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient,
                private router:Router) {
        
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email, password) {
        
        //console.log(email+"dfdsfdsf   "+password);
         return this.http.post<any>(environment.apiUrl+'/login', { email, password })
             .pipe(map(user => {
                 // store user details and jwt token in local storage to keep user logged in between page refreshes
                 localStorage.setItem('currentUser', JSON.stringify(user.response));
                 //console.log('token',JSON.stringify(user.response.token));
                 //localStorage.setItem('token', JSON.stringify(user.response.token));
                 this.currentUserSubject.next(user);
                 return user;
                 //console.log(user);
             })
             
             );
             alert('Wrong  Credentials');
    }

    logout() {

        if ("currentUser" in localStorage) {
            return true;
        } else {
            localStorage.removeItem('currentUser');
            // remove user from local storage and set current user to null
            this.currentUserSubject.next(null);
            return false;
        }
        
        
    }
}