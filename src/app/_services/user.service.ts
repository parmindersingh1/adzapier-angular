import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { User } from './../_models';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { map, shareReplay, retry, catchError } from 'rxjs/operators';



@Injectable({ providedIn: 'root' })
export class UserService {

    public currentregSubject: BehaviorSubject<User>;
    public currentregUser: Observable<User>;
    userDetails: User;
    userProfileSubject = new Subject<User>();
    @Output() getCurrentUser: EventEmitter<any> = new EventEmitter<any>();
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
        const key = 'response';
        return this.http.get<User[]>(environment.apiUrl + '/user').pipe(map(res => res[key]), shareReplay());
    }

    // login(user: User){
    //     return this.http.post(environment.apiUrl+'/users/login', user
    // }

    register(obj) {
        return this.http.post<any>(environment.apiUrl + '/user', obj)
            .pipe(map(user => {
                //         // store user details and jwt token in local storage to keep user logged in between page refreshes
                //localStorage.setItem('currentregUser', JSON.stringify(user.response));
                this.currentregSubject.next(user);
                return user;

            }),
                retry(1),
                catchError(this.handleError)
            );
    }


    resetpassword(token, password, confirmpassword): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/password/reset', { token, password, confirmpassword });
    }


    forgotpswd(email) {
        return this.http.post<any>(environment.apiUrl + '/password/forgot', { email })
            .pipe(map(user => {
            })
            );
    }

    delete(id: number) {
        return this.http.delete(environment.apiUrl + '/users/${id}', {});
    }


    update(profileObj) {
        return this.http.put<any>(environment.apiUrl + '/user', profileObj);
    }

    getLoggedInUserDetails(): Observable<User> {
        const key = 'response';
        return this.http.get<User>(environment.apiUrl + '/user').pipe(shareReplay()); // map(res => res[key]),
    }

    getCurrentUserProfile(): Observable<User> {
        return this.userProfileSubject.asObservable();
    }

    updatePropertyList(data) {
        this.organizationProperty.next(data);
    }

    verifyEmailAddress(tokenObj): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/email/verify', tokenObj);
    }

    getRoleList(): Observable<any> {
        return this.http.get<any>(environment.apiUrl + '/role');
    }

    handleError(error) {
        let errorMessage = '';
        if (error.email_error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.email_error}`;

        } else {
            // server-side error
            errorMessage = `${error.email_error}`;
        }
        return throwError(errorMessage);
    }

}
