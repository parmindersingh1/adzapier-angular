import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from './../../environments/environment.staging';
import { User } from './../_models';
import { Router } from '@angular/router';

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
        return this.http.post<any>(environment.apiUrl + '/login', { email, password });
    }
 
    logout(): boolean {
        this.userLoggedIn.next(false);
        this.router.navigate(['/login']);
        this.currentUserSubject.next(null);
        localStorage.removeItem('currentUser');
        return true;

    }
}
