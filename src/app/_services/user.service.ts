import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment.staging';
import { User } from './../_models';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
 


@Injectable({ providedIn: 'root' })
export class UserService {

    public currentregSubject: BehaviorSubject<User>;
    public currentregUser: Observable<User>;
    userDetails: User;
    userProfileSubject = new Subject<User>();
    @Output() getCurrentUser : EventEmitter<User> = new EventEmitter<User>();
    private organizationProperty = new Subject<any>();
    organizationProperty$ = this.organizationProperty.asObservable();
    constructor(private http: HttpClient) {
        this.currentregSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentregUser')));
        this.currentregUser = this.currentregSubject.asObservable();
     }

     public getcurrentUserValue(): User {
        return this.currentregSubject.value;
    }

    getAll() {
        return this.http.get<User[]>(environment.apiUrl+'/user');
    }

    // login(user: User){
    //     return this.http.post(environment.apiUrl+'/users/login', user
    // }

    register(firstName, lastName, orgname, email, password, confirmpassword ) {
        return this.http.post<any>(environment.apiUrl+'/user', { firstName, lastName, orgname, email, password, confirmpassword })
             .pipe(map(user => {
        //         // store user details and jwt token in local storage to keep user logged in between page refreshes
                 //localStorage.setItem('currentregUser', JSON.stringify(user.response));
                 this.currentregSubject.next(user);
                 return user;
                
             })
                        
             );
             alert('Wrong  Credentials');
    }


    resetpassword(token, password, confirmpassword ) {
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
        return this.http.delete(environment.apiUrl + '/users/${id}',{});
    }


    update(firstName,lastName) {
        return this.http.put<any>(environment.apiUrl + '/user', {firstName,lastName})
    }

    getLoggedInUserDetails(): Observable<User> {
        return this.http.get<User>(environment.apiUrl + '/user');
    }

    getCurrentUserProfile(): Observable<User>{
       return this.userProfileSubject.asObservable();
    }

    updatePropertyList(data) {
        this.organizationProperty.next(data);
    }
}
