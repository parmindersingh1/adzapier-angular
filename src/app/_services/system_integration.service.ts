import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';
import {LokiFunctionality, LokiStatusType} from '../_constant/loki.constant';
import {throwError} from 'rxjs';
import {LokiService} from './loki.service';
import {apiConstant} from '../_constant/api.constant';



@Injectable({
  providedIn: 'root'
})
export class SystemIntegrationService {
  applicationPath: string;
  constructor(private http: HttpClient,
              private lokiService: LokiService
              ) {
    this.applicationPath =  location.pathname;
  }
  SaveSystemIntegration(componentName, moduleName, systemID, payload) {
    const path = `/integration/connection/${systemID}`;
    return this.http.post(environment.apiUrl + path, payload)
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflow, componentName, moduleName, path);
        return throwError(error);
      }));
  }


  UpdateSystemIntegration(componentName, moduleName, systemID, connectionID,  payload) {
    const path = `/integration/connection/${systemID}/${connectionID}`;
    return this.http.put(environment.apiUrl + path, payload)
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflow, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  TestSystemIntegration(componentName, moduleName, connectionID, payload, params) {
    const path = `/integration/live-check-connection-status`;
    return this.http.post(environment.apiUrl + path, payload, {params:params})
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflow, componentName, moduleName, path);
        return throwError(error);
      }));
  }


  SaveConnectionIntegration(componentName, moduleName, payload) {
    const path = '/integration/connection';
    return this.http.post(environment.apiUrl + path, payload)
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflow, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  GetSystemList(componentName, moduleName) {
    const path = apiConstant.SYSTEM_INTEGRATION_LIST;
    return this.http.get(environment.apiUrl + path)
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflow, componentName, moduleName, path);
        return throwError(error);
      }));
  }
  GetCredListByCompany(componentName, moduleName) {
    const path = apiConstant.CONNECTION_INTEGRATION_LIST;
    return this.http.get(environment.apiUrl + path)
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflow, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  GetCredListBySystem(componentName, moduleName) {
    const path = apiConstant.CONNECTION_INTEGRATION_LIST;
    return this.http.get(environment.apiUrl + path)
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflow, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  GetSqlTables(componentName, connectionId, moduleName) {
    const path = apiConstant.SQL_TABLES_LIST + '/' + connectionId;
    return this.http.get(environment.apiUrl + path)
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflow, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  GetSqlTableColumns(componentName, connectionId, param, moduleName) {
    const path = apiConstant.SQL_TABLE_COLUMNS_LIST + '/' + connectionId;
    return this.http.get(environment.apiUrl + path, {params: param})
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflow, componentName, moduleName, path);
        return throwError(error);
      }));
  }


  GetCredList(componentName, moduleName) {
    const path = apiConstant.SYSTEM_INTEGRATION_LIST;
    return this.http.get(environment.apiUrl + path)
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflow, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  GetConnectionListBySystemID(componentName, moduleName, systemId) {
    const path = `/integration/connection/${systemId}`;
    return this.http.get(environment.apiUrl + path)
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflow, componentName, moduleName, path);
        return throwError(error);
      }));
  }


  onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
    this.lokiService.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
  }

  saveQueryBuilder(componentName, moduleName, payload, oID, connectionID, formID) {
      const path = '/integration/save-query-builder/' + oID  + '/' + connectionID + '/' + formID;
      return this.http.post(environment.apiUrl + path, payload)
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflow, componentName, moduleName, path);
        return throwError(error);
  }));
}
}
