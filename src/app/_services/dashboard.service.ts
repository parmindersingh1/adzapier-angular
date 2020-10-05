import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {apiConstant} from '../_constant/api.constant';
import {catchError, map} from 'rxjs/operators';
import {LokiFunctionality, LokiStatusType} from '../_constant/loki.constant';
import {LokiService} from './loki.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient,
              private loki: LokiService
              ) { }
  getCcpaAndDsar(orgId, propsID, queryParam): Observable<any> {
    let path = apiConstant.DASHBOARD_CCPA_REQUEST_CHART.replace(':orgId', orgId);
    path = path.replace(':propId', propsID);
    return this.http.get(environment.apiUrl + path, { params : queryParam}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.ccpaDashboard, path);
        return throwError(error);
      }),
    );
  }
  getRequestByState(orgId, propsID, queryParam): Observable<any> {
    let path = apiConstant.DASHBOARD_REQUEST_BY_STATE.replace(':orgId', orgId);
    path = path.replace(':propId', propsID);
    return this.http.get(environment.apiUrl + path, { params : queryParam}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.ccpaDashboard, path);
        return throwError(error);
      }),
    );
  }
  getDashboardData(propId) {
    const path = apiConstant.DASHBOARD_CONSENT_DATA.replace(':propId', propId);
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, path);
        return throwError(error);
      }),
    );
  }

  getOtpInActivity(propId) {
    const path = apiConstant.DASHBOARD_OPT_IN_ACTIVITY.replace(':propId', propId);
    return this.http.get(environment.apiUrl  + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, path);
        return throwError(error);
      }),
    );
  }

  getOtpOutActivity(propId) {
    const path = apiConstant.DASHBOARD_OPT_OUT_ACTIVITY.replace(':propId', propId);
    return this.http.get(environment.apiUrl  + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, path);
        return throwError(error);
      }),
    );
  }
  getConsentDetails(propId, params) {
    const path = apiConstant.DASHBOARD_CONSENT_DETAILS.replace(':propId', propId);
    return this.http.get(environment.apiUrl  + path, {params}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, path);
        return throwError(error);
      }),
    );
  }
  getCookieConsentCountry(propId: any, params: any) {
    const path = apiConstant.DASHOBARD_CONSENT_COUNTRY_LIST.replace(':propId', propId);
    return this.http.get(environment.apiUrl  + path, {params}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, path);
        return throwError(error);
      }),
    );
  }

  getMapDataForConsentDashboard(propId, params) {
    const path = apiConstant.DASHOBARD_CONSENT_MAP_LIST.replace(':propId', propId);
    return this.http.get(environment.apiUrl  + path, {params}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, path);
        return throwError(error);
      }),
    );
  }


  onSendLogs(errorType, msg, functionality, path) {
    this.loki.onSendErrorLogs(errorType, msg, functionality, path).subscribe();
  }
}
