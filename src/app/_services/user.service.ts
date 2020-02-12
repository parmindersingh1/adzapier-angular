﻿import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment.staging';
import { User } from './../_models';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 


@Injectable({ providedIn: 'root' })
export class UserService {

    private currentregSubject: BehaviorSubject<User>;
    public currentregUser: Observable<User>;
    
    constructor(private http: HttpClient) {
        this.currentregSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentregUser')));
        this.currentregUser = this.currentregSubject.asObservable();
     }

     public get currentUserValue(): User {
        return this.currentregSubject.value;
    }

    getAll() {
        return this.http.get<User[]>(environment.apiUrl+'/users');
    }

    // login(user: User){
    //     return this.http.post(environment.apiUrl+'/users/login', user
    // }

    register(firstName, lastName, orgname, email, password, confirmpassword ) {
        return this.http.post<any>(environment.apiUrl+'/users', { firstName, lastName, orgname, email, password, confirmpassword })
             .pipe(map(user => {
        //         // store user details and jwt token in local storage to keep user logged in between page refreshes
                 //localStorage.setItem('currentregUser', JSON.stringify(user.response));
                 this.currentregSubject.next(user);
                 return user;
                 //console.log(user);
             })
                        
             );
             alert('Wrong  Credentials');
    }


    resetpswd(token, password, confirmpassword ) {
        return this.http.post<any>(environment.apiUrl+'/password/reset', {token, password, confirmpassword })
             .pipe(map(user => {
             })
             );
             alert('Wrong  Credentials');
    }


    forgotpswd(email) {
        return this.http.post<any>(environment.apiUrl+'/password/forgot', {email})
             .pipe(map(user => {
             })
             );
             alert('Wrong  Credentials');
    }

    delete(id: number) {
        return this.http.delete(environment.apiUrl+'/users/${id}');
    }
}