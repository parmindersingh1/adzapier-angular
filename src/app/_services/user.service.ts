import { Injectable, EventEmitter, Output, Directive } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { User } from './../_models';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { map, shareReplay, retry, catchError, take } from 'rxjs/operators';
import { LokiService } from './loki.service';
import { LokiFunctionality, LokiStatusType } from '../_constant/loki.constant';
import { apiConstant } from '../_constant/api.constant';

@Directive()
@Injectable({ providedIn: 'root' })
export class UserService {
    private SupportData = new BehaviorSubject(null);
    public SupportDetails = this.SupportData.asObservable();
    

    public currentregSubject: BehaviorSubject<User>;
    public currentregUser: Observable<User>;
    userDetails: User;
    userProfileSubject = new Subject<User>();
    @Output() getCurrentUser: EventEmitter<any> = new EventEmitter<any>();
    @Output() onClickTopmenu: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onClickQuickStartmenux: EventEmitter<boolean> = new EventEmitter<boolean>(false);
    isSideMenuClicked:boolean = false;
    isSideMenuVisible:boolean = false;
    public onClickQuickStartmenu: BehaviorSubject<UserActionOnQuickstart> = new BehaviorSubject<UserActionOnQuickstart>({quickstartid:0,isclicked:false,isactualbtnclicked:false});
    get isClickedOnQSMenu() {
        return this.onClickQuickStartmenu.asObservable();
    }
    public addUserActionOnActualButton = new BehaviorSubject<UserActionOnQuickstart>({quickstartid:0,isclicked:false,isactualbtnclicked:false});
    get onClickActualBtnByUser() {
        return this.addUserActionOnActualButton.asObservable();
    }
    public userActionOnQuickstart = new BehaviorSubject<UserActionOnQuickstart>({ quickstartid: 0, isclicked: false, isactualbtnclicked:false });
    get onClickQSTooltipByUser() {
        return this.userActionOnQuickstart.asObservable();
    }

    public onRevistQuickStartmenulink: BehaviorSubject<UserActionOnQuickstartv2> = new BehaviorSubject<UserActionOnQuickstartv2>({ quickstartid:0, reclickqslink:false, urlchanged:false});
    //public onClickQuickStartmenu: BehaviorSubject<any> = new BehaviorSubject<any>(false);
    get isRevisitedQSMenuLink() {
        return this.onRevistQuickStartmenulink.asObservable();
    }

    public onClickHeaderNavBar: BehaviorSubject<any> = new BehaviorSubject<any>(false);
    get isClickedOnHeaderMenu() {
        return this.onClickHeaderNavBar.asObservable();
    }

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

    registration(componentName, moduleName, obj) {
        const path = '/register';
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


    AddOrgCmpProp(componentName, moduleName, obj, emailid, userid, plan_id, units, plan_type) {
        const path = apiConstant.REGISTRATION_ADD_COMPANY_ORG_PROP
        return this.http.post(environment.apiUrl + path + '?email=' + emailid + '&userid=' + userid + '&plan_id=' + plan_id + '&units=' + units + '&plan_type=' + plan_type, obj).pipe(catchError(error => {
            this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.registerUser, componentName, moduleName, path);
            return throwError(error);
        }));
    }

    inviteusersetpassword(componentName, moduleName, user_id:string ,token, newpassword, confirmnewpassword): Observable<any> {
        const path = '/invite/user/setpassword/' + user_id + '?token=' + token ;
        return this.http.post<any>(environment.apiUrl + path , { newpassword, confirmnewpassword })
        .pipe(catchError(error => {
            this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.resetPassword, componentName, moduleName, path);
            return throwError(error);
          }));
    }
    
    onPushConsentData(suppData) {
        return new Promise(resolve => {
          resolve(this.SupportData.next(suppData));
        });
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
        return this.http.get<User>(environment.apiUrl + path).pipe(take(1),
            catchError(error => {
                this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getLoggedInUserDetails, componentName, moduleName, path);
                return throwError(error);
            })
        );
    }

    getLoggedQSMList(componentName, moduleName): Observable<any> {
        const path = '/user';
        return this.http.get<any>(environment.apiUrl + path).pipe(take(1),
            map((result) => {
                return result.response;
            }),

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
        const path = '/email/verify';
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

    getList(componentName, moduleName,query,categories): Observable<any> {
        const path = 'https://support.adzapier.com/secure/search/articles';
        return this.http.get<any>(path + '?query=' + query + '&categories=' + categories).pipe(
            catchError(error => {
                this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.userRole, componentName, moduleName, path);
                return throwError(error);
            })
        );
    }

    getRecordList(componentName, moduleName,id,categories): Observable<any> {
        const path = 'https://support.adzapier.com/secure/help-center/articles/';
        return this.http.get<any>(path  + id + '?categories=' + categories).pipe(
            catchError(error => {
                this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.userRole, componentName, moduleName, path);
                return throwError(error);
            })
        );
    }

    getverifyemailRecord(email): Observable<any> {
        const path = '/register/checkemailverify' + '?email=' + email;
        return this.http.get<any>(environment.apiUrl + path)
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

    checkIsNotificationVisited(componentName, moduleName): Observable<any> {
        const path = "/notification/time";
        return this.http.put<any>(environment.apiUrl + path, {}).pipe(
            catchError(error => {
                this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.checkIsNotificationVisited, componentName, moduleName, path);
                return throwError(error);
            })
        );
    }

    resendEmailVerificationToken(componentName, moduleName, reqObj): Observable<any> {
        const path = "/user/verifyemail";
        return this.http.post<any>(environment.apiUrl + path, reqObj).pipe(
            catchError(error => {
                this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.resendEmailVerificationToken, componentName, moduleName, path);
                return throwError(error);
            })
        );
    }

    setSidemenulist(data) {
        localStorage.setItem('sidemenuList', JSON.stringify(data));
    }

    removeSidemenulist() {
        localStorage.removeItem('sidemenuList');
    }

    getSidemenulist(): any {
        if (localStorage.getItem('sidemenuList') !== null) {
            return JSON.parse(localStorage.getItem('sidemenuList'));
        }
    }

    setSidemenuOpenStatus(status){
        localStorage.setItem('sidemenustatus', JSON.stringify(status));
    }

    removeSidemenuOpenStatus() {
        localStorage.removeItem('sidemenustatus');
    }

    getSidemenuOpenStatus(): any {
        if (localStorage.getItem('sidemenustatus') !== null) {
            return JSON.parse(localStorage.getItem('sidemenustatus'));
        }
    }

    onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
        this.lokiService.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
    }

}

export class UserActionOnQuickstart {
    public quickstartid: number;
    public isclicked: boolean | any;
    public isactualbtnclicked: boolean | any;
    
}

export class UserActionOnQuickstartv2 {
    public quickstartid: number;
    public urlchanged:boolean | any;
    // public isclicked: boolean | any;
    // public isactualbtnclicked: boolean | any;
    public reclickqslink:boolean | any;
}
