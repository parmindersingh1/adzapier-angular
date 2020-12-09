import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, shareReplay, retry, catchError } from 'rxjs/operators';
import { LokiFunctionality, LokiStatusType } from './_constant/loki.constant';
import { LokiService } from './_services/loki.service';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private httpClient: HttpClient, private lokiService: LokiService) { }

  getCompanyDetails(componentName, moduleName): Observable<any> {
    const path = '/company';
    return this.httpClient.get<any>(environment.apiUrl + path).pipe(catchError(error => {
      this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getCompanyDetails, componentName, moduleName, path);
      return throwError(error);
    }));
  }

  updateCompanyDetails(componentName, moduleName, reqestObj): Observable<any> {
    const path = '/company';
    return this.httpClient.put<any>(environment.apiUrl + path, reqestObj).pipe(catchError(error => {
      this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.updateCompanyDetails, componentName, moduleName, path);
      return throwError(error);
    }));
  }

  getCompanyTeamMembers(componentName, moduleName, pagelimit?): Observable<any> {
    const path = '/team_member';
    return this.httpClient.get<any>(environment.apiUrl + path + pagelimit).pipe(catchError(error => {
      this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getCompanyTeamMembers, componentName, moduleName, path);
      return throwError(error);
    }));
  }

  inviteUser(componentName, moduleName, reqestObj): Observable<any> {
    const path = '/invite/user';
    return this.httpClient.post<any>(environment.apiUrl + path, reqestObj).pipe(shareReplay(1), catchError(error => {
      this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.inviteUser, componentName, moduleName, path);
      return throwError(error);
    }));
  }

  updateUserRole(componentName, moduleName, reqestObj): Observable<any> {
    const path = '/invite/user';
    return this.httpClient.put<any>(environment.apiUrl + path, reqestObj).pipe(catchError(error => {
      this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.updateUserRole, componentName, moduleName, path);
      return throwError(error);
    }));
  }

  removeTeamMember(componentName, moduleName, obj, orgid?): Observable<any> {
    let path;
    if (orgid) {
      path = '/invite/user/' + obj.id + '/' + obj.approver_id + '?orgid=' + orgid;
    } else {
      path = '/invite/user/' + obj.id + '/' + obj.approver_id;
    }
    return this.httpClient.delete<any>(environment.apiUrl + path)
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.removeTeamMember, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  resendInvitation(componentName, moduleName, userId): Observable<any> {
    const path = '/invite/user/resend/';
    return this.httpClient.get<any>(environment.apiUrl + path + userId, {})
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.resendInvitation, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  getUserList(query, componentName, moduleName): Observable<any> {
    const path = '/invite/user/list?query=' + query;
    return this.httpClient.get<any>(environment.apiUrl + path)
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getUserList, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
    this.lokiService.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
  }

}

