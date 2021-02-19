import { Injectable, EventEmitter, Output, Directive } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { User } from './../_models';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { map, shareReplay, retry, catchError } from 'rxjs/operators';
import {LokiService} from './loki.service';
import {LokiFunctionality, LokiStatusType} from '../_constant/loki.constant';

@Directive()
@Injectable({ providedIn: 'root' })
export class UserService {

    public currentregSubject: BehaviorSubject<User>;
    public currentregUser: Observable<User>;
    userDetails: User;
    userProfileSubject = new Subject<User>();
    @Output() getCurrentUser: EventEmitter<any> = new EventEmitter<any>();
    private organizationProperty = new Subject<any>();
    organizationProperty$ = this.organizationProperty.asObservable();
    constructor(private http: HttpClient, private lokiService: LokiService) {
        this.currentregSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentregUser')));
        this.currentregUser = this.currentregSubject.asObservable();
    }

    public getcurrentUserValue(): User {
        return this.currentregSubject.value;
    }

    getAll(componentName, moduleName) {
        const key = 'response';
        const path = '/user';
        return this.http.get<User[]>(environment.apiUrl + path).pipe(map(res => res[key]), shareReplay(),
        catchError(error => {
            this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getAll, componentName, moduleName, path);
            return throwError(error);
          }));
    }

    // login(user: User){
    //     return this.http.post(environment.apiUrl+'/users/login', user
    // }

    register(componentName, moduleName, obj) {
        const path = '/user';
        return this.http.post<any>(environment.apiUrl + `${path}`, obj)
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                this.currentregSubject.next(user);
                return user;

            }),
                retry(1),
                catchError(error => {
                    this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.registerUser, componentName, moduleName, path);
                    return throwError(error);
                  })
            );
    }


    resetpassword(componentName, moduleName, token, password, confirmpassword): Observable<any> {
        const path = '/password/reset';
        return this.http.post<any>(environment.apiUrl + path, { token, password, confirmpassword })
        .pipe(catchError(error => {
            this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.resetPassword, componentName, moduleName, path);
            return throwError(error);
          }));
    }


    forgotpswd(componentName, moduleName, email) {
        const path = '/password/forgot';
        return this.http.post<any>(environment.apiUrl + path, { email })
            .pipe(catchError(error => {
                this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.forgotPassword, componentName, moduleName, path);
                return throwError(error);
              }));

    }

    delete(id: number) {
        return this.http.delete(environment.apiUrl + '/users/${id}', {});
    }


    update(componentName, moduleName, profileObj) {
        const path = '/user';
        return this.http.put<any>(environment.apiUrl + path, profileObj)
        .pipe(catchError(error => {
            this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.updateUserProfile, componentName, moduleName, path);
            return throwError(error);
          }));
    }

    getLoggedInUserDetails(componentName, moduleName): Observable<User> {
        const path = '/user';
        return this.http.get<User>(environment.apiUrl + path).pipe(shareReplay(1),
        catchError(error => {
            this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getLoggedInUserDetails, componentName, moduleName, path);
            return throwError(error);
          })
        );
    }

    getCurrentUserProfile(): Observable<User> {
        return this.userProfileSubject.asObservable();
    }

    updatePropertyList(data) {
        this.organizationProperty.next(data);
    }

    verifyEmailAddress(componentName, moduleName, tokenObj): Observable<any> {
        const path =  '/email/verify';
        return this.http.post<any>(environment.apiUrl + path, tokenObj).pipe(
            catchError(error => {
                this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.verifyUserEmailID, componentName, moduleName, path);
                return throwError(error);
              })
        );
    }

    getRoleList(componentName, moduleName): Observable<any> {
        const path = '/role';
        return this.http.get<any>(environment.apiUrl + path).pipe(
            catchError(error => {
                this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.userRole, componentName, moduleName, path);
                return throwError(error);
              })
        );
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

    getNotification(componentName, moduleName): Observable<any> {
        const path = '/notification';
        return this.http.get<any>(environment.apiUrl + path).pipe(
            catchError(error => {
                this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getNotification, componentName, moduleName, path);
                return throwError(error);
              })
        );
    }

    updateNotification(componentName, moduleName, requestobj): Observable<any> {
        const path = '/notification';
        return this.http.put<any>(environment.apiUrl + path, requestobj).pipe(
            catchError(error => {
                this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getNotification, componentName, moduleName, path);
                return throwError(error);
              })
        );

    }

    checkIsNotificationVisited(componentName, moduleName): Observable<any>{
        const path = "/notification/time";
        return this.http.put<any>(environment.apiUrl + path, {}).pipe(
            catchError(error => {
                this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.checkIsNotificationVisited, componentName, moduleName, path);
                return throwError(error);
              })
        );
    }

    onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
        this.lokiService.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
      }

}
