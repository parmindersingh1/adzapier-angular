import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { LokiService } from './loki.service';
import { LokiFunctionality, LokiStatusType } from '../_constant/loki.constant';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CcpadataService {

  constructor(private httpClient: HttpClient, private lokiService: LokiService) { }

  createCCPAData(orgID, propID, crID, dataObj) {
    return this.httpClient.post<any>(environment.apiUrl + '/ccpa/data/' + orgID + '/' + propID + '/' + crID, dataObj);
  }

  addCCPADataActivity(componentName, moduleName, activitytype, ccpaDataId, reqObj) {
    const activityType = activitytype === 0 ? 'internal' : 'public';
    const path = '/ccpa/activity/' + activityType + '/' + ccpaDataId;
    return this.httpClient.post<any>(environment.apiUrl + path, reqObj)
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflow, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  getCCPADataActivityLog(componentName, moduleName, activitytype, ccpaDataId, pageLimit?): Observable<any> {
    const activityType = 'internal';
    if (pageLimit !== undefined) {
      const path = '/ccpa/activity/' + activityType + '/' + ccpaDataId + pageLimit;
      return this.httpClient.get<any>(environment.apiUrl + path)
        .pipe(catchError(error => {
          this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getCCPADataActivityLog, componentName, moduleName, path);
          return throwError(error);
        }));
    } else {
      const path = '/ccpa/activity/' + activityType + '/' + ccpaDataId;
      return this.httpClient.get<any>(environment.apiUrl + path)
        .pipe(catchError(error => {
          this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getCCPADataActivityLog, componentName, moduleName, path);
          return throwError(error);
        }));
    }
  }

  addCCPADataEmailActivity(componentName, moduleName, ccpaDataId, reqObj) {
    const path = '/ccpa/email/' + ccpaDataId;
    return this.httpClient.post<any>(environment.apiUrl + path, reqObj)
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflow, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  getCCPADataEmailLog(componentName, moduleName, ccpaDataId): Observable<any> {
    const path = '/ccpa/email/' + ccpaDataId;
    return this.httpClient.get<any>(environment.apiUrl + path).pipe(
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflow, componentName, moduleName, path);
        return throwError(error);
      })
    );
  }

  deleteDSARRequestByID(componentName, moduleName, orgID, propID, ccpaDataId) {
    const path = '/ccpa/data/' + orgID + '/' + propID + '/' + ccpaDataId;
    return this.httpClient.delete<any>(environment.apiUrl + path).pipe(
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflow, componentName, moduleName, path);
        return throwError(error);
      })
    );
  }

  onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
    this.lokiService.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
  }
}
