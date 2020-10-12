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
    const path = apiConstant.BILLING_CURRENT_PLAN_INFO;
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
}
