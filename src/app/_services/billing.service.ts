import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {LokiService} from './loki.service';
import {catchError, map} from 'rxjs/operators';
import {LokiFunctionality, LokiStatusType} from '../_constant/loki.constant';
import {throwError} from 'rxjs';
import {apiConstant} from '../_constant/api.constant';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor(private http: HttpClient,
              private loki: LokiService
              ) { }
  getSessionId(data, componentName, moduleName) {
    const path = apiConstant.BILLING_CREATE_SESSION_ID;
    return this.http.post(environment.apiUrl + path, data).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.billing, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  getCurrentPlan(componentName, moduleName) {
    const path = apiConstant.BILLING_CURRENT_SUBSCRIPTION;
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.billing, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }
  // /assign/license/property?planID="xxxx"&pID="yyyy"

  assignPropertyLicence(componentName, moduleName, payloads){
    const path = apiConstant.BILLING_ASSIGNE_PROPERTY;
    return this.http.post(environment.apiUrl + path, '' , { params: payloads}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.updateBilling, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }


  getAllPropertyList(componentName, moduleName){
    const path = apiConstant.BILLING_LIST_ALL_PROPERTY;
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.updateBilling, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  removeProperty(componentName, moduleName, payloads){
    const path = apiConstant.BILLING_UNSSIGNE_PROPERTY;
    return this.http.put(environment.apiUrl + path, '' , { params: payloads}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.updateBilling, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  getAssignedLicenseByPropsID(componentName, moduleName, planID){
    const path = apiConstant.BILLING_GET_ASSIGNE_PROP;
    return this.http.get(environment.apiUrl + path, { params: {planID: planID}}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.updateBilling, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }
  createSessionId(componentName, moduleName) {
    const path = apiConstant.BILLING_UPDATE_SESSION_ID;
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.updateBilling, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }
  getCurrentPlanInfo(componentName, moduleName) {
    const path = apiConstant.BILLING_CURRENT_PLAN_DETAILS;
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.billing, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }
  upGradePlan(data, componentName, moduleName) {
  const path = apiConstant.BILLING_UPGRADE_PLAN;
  return this.http.post(environment.apiUrl + path, data).pipe(map(res => res),
    catchError(error => {
      this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.updateBilling, componentName, moduleName, path);
      return throwError(error);
    }),
  );
}

  getActivePlan(componentName, moduleName) {
    const path = apiConstant.BILLING_ACTIVE_PLAN;
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.billing, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }


  cancelPlan(componentName, moduleName) {
    const path = apiConstant.BILLING_CANCEL_PLAN;
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.billing, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
    this.loki.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
  }

  coupon(coupon, componentName, moduleName) {
    let path = apiConstant.BILLING_COUPON;
    path = path.replace(':coupon_code', coupon);
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.billing, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }
}
