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
  getCcpaAndDsar(orgId, propsID, queryParam, componentName, moduleName): Observable<any> {
    let path = apiConstant.DASHBOARD_CCPA_REQUEST_CHART.replace(':orgId', orgId);
    path = path.replace(':propId', propsID);
    return this.http.get(environment.apiUrl + path, { params : queryParam}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.ccpaDashboard, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }
  getRequestByState(orgId, propsID, queryParam, componentName, moduleName): Observable<any> {
    let path = apiConstant.DASHBOARD_REQUEST_BY_STATE.replace(':orgId', orgId);
    path = path.replace(':propId', propsID);
    return this.http.get(environment.apiUrl + path, { params : queryParam}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.ccpaDashboard, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }
  getDashboardData(params, propId, componentName, moduleName) {
    const path = apiConstant.DASHBOARD_CONSENT_DATA.replace(':propId', propId);
    return this.http.get(environment.apiUrl + path, {params: params}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  getOtpInActivity(params, propId, componentName, moduleName) {
    const path = apiConstant.DASHBOARD_OPT_IN_ACTIVITY.replace(':propId', propId);
    return this.http.get(environment.apiUrl  + path, {params: params}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  getOtpOutActivity(params, propId, componentName, moduleName) {
    const path = apiConstant.DASHBOARD_OPT_OUT_ACTIVITY.replace(':propId', propId);
    return this.http.get(environment.apiUrl  + path, {params: params}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, componentName,  moduleName, path);
        return throwError(error);
      }),
    );
  }
  getConsentDetails(params, propId, componentName, moduleName) {
    const path = apiConstant.DASHBOARD_CONSENT_DETAILS.replace(':propId', propId);
    return this.http.get(environment.apiUrl  + path, {params: params}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }
  getCookieConsentCountry(propId: any, params: any, componentName, moduleName) {
    const path = apiConstant.DASHOBARD_CONSENT_COUNTRY_LIST.replace(':propId', propId);
    return this.http.get(environment.apiUrl  + path, {params}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  getMapDataForConsentDashboard(propId, params, componentName, moduleName) {
    const path = apiConstant.DASHOBARD_CONSENT_MAP_LIST.replace(':propId', propId);
    return this.http.get(environment.apiUrl  + path, {params}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }


  onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
    this.loki.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
  }
}
