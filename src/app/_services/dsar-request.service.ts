import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { from, Observable, throwError } from 'rxjs';
import { shareReplay, map, catchError } from 'rxjs/operators';
import { LokiService } from './loki.service';
import { LokiFunctionality, LokiStatusType } from '../_constant/loki.constant';

@Injectable({
  providedIn: 'root'
})
export class DsarRequestService {
  subTasklist$: Observable<any[]>;
  constructor(private http: HttpClient, private lokiService: LokiService) { }

  getDsarRequestList(componentName, moduleName, orgId, propsID, pagelimit, orderBy?, dateRange?): Observable<any> {
    let path = '/ccpa/data/' + orgId + '/' + propsID + pagelimit;
    if (orderBy === undefined) {
      return this.http.get<any>(environment.apiUrl + path)
        .pipe(shareReplay(1), catchError(error => {
          this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getDsarRequestList, componentName, moduleName, path);
          return throwError(error);
        }));
    } else if(dateRange !== undefined){
      return this.http.get<any>(environment.apiUrl + path + dateRange)
      .pipe(shareReplay(1), catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getDsarRequestList, componentName, moduleName, path);
        return throwError(error);
      }));
    } else {
      path = '/ccpa/data/' + orgId + '/' + propsID + pagelimit + orderBy;
      return this.http.get<any>(environment.apiUrl + path)
        .pipe(shareReplay(1), catchError(error => {
          this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getDsarRequestList, componentName, moduleName, path);
          return throwError(error);
        }));
    }

  }

  getDsarRequestFilter(orgId, propsID, componentName, moduleName) {
    const path = '/ccpa/filter/' + orgId + '/' + propsID;
    return this.http.get(environment.apiUrl + path)
      .pipe(shareReplay(1), catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getDsarRequestFilter, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  getDsarRequestFilterList(orgId, propsID, pagelimit, componentName, moduleName) {
    const path = '/ccpa/data/' + orgId + '/' + propsID + pagelimit;
    return this.http.get(environment.apiUrl + path).pipe(shareReplay(1), catchError(error => {
      this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getDsarRequestFilterList, componentName, moduleName, path);
      return throwError(error);
    }));
  }

  getDSARRequestDetails(orgID, propID, dataReqID, componentName, moduleName): Observable<any> {
    const path = '/ccpa/data/' + orgID + '/' + propID + '/' + dataReqID;
    return this.http.get<any>(environment.apiUrl + path)
      .pipe(shareReplay(1), catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getDSARRequestDetails, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  getEmailTemplate(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/email/template');
  }

  // To update request details by id
  getDSARRequestDetailsByID(orgID, propID, dataReqID, componentName, moduleName) {
    const path = '/ccpa/data/' + orgID + '/' + propID + '/' + dataReqID + '?edit_fields=true';
    return this.http.get<any>(environment.apiUrl + path)
      .pipe(shareReplay(1), catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getDSARRequestDetailsByID, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  updateDSARRequestDetailsByID(orgID, propID, dataReqID, requestObj, componentName, moduleName): Observable<any> {
    const path = '/ccpa/data/' + orgID + '/' + propID + '/' + dataReqID;
    return this.http.put<any>(environment.apiUrl + path, requestObj)
      .pipe(shareReplay(1), catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.updateDSARRequestDetailsByID, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  addSubTask(companyID, requestID, stageID, requestObj, componentName, moduleName) {
    const path = '/ccpa/subtask/' + companyID + '/' + requestID + '/' + stageID;
    return this.http.post<any>(environment.apiUrl + path, requestObj)
      .pipe(shareReplay(1), catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.addSubTask, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  updateSubTask(companyID, subtaskID, requestObj, componentName, moduleName) {
    const path = '/ccpa/subtask/edit/' + companyID + '/' + subtaskID;
    return this.http.put<any>(environment.apiUrl + path, requestObj)
      .pipe(shareReplay(1), catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.updateSubTask, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  addSubTaskResponse(taskID, requestObj, componentName, moduleName) {
    const path = '/ccpa/subtask/response/' + taskID;
    return this.http.put<any>(environment.apiUrl + path, requestObj)
      .pipe(shareReplay(1), catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.addSubTaskResponse, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  getSubTask(componentName, moduleName, requestID, stageID, subtaskID?): Observable<any> {

    if (subtaskID) {
      // if (!this.subTasklist$) {
      const path = '/ccpa/subtask/' + requestID + '/' + stageID + '/' + subtaskID;
      return this.http.get<any>(environment.apiUrl + path).pipe(shareReplay(1), catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getSubTask, componentName, moduleName, path);
        return throwError(error);
      }));
      // }
      // return this.subTasklist$;
    } else {
      const path = '/ccpa/subtask/' + requestID + '/' + stageID;
      return this.http.get<any>(environment.apiUrl + path)
        .pipe(shareReplay(1), catchError(error => {
          this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getSubTask, componentName, moduleName, path);
          return throwError(error);
        }));
      // return this.subTasklist$;
    }

  }

  viewUserUploadedFile(requestID, componentName, moduleName) {
    const key = 'response';
    const path = '/dsar/user/file/' + requestID;
    return this.http.get<any>(environment.apiUrl + path)
      .pipe(map((res) => res[key]), shareReplay(1), catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.viewUserUploadedFile, componentName, moduleName, path);
        return throwError(error);
      }));
  }
  getSubTaskByWorkflowID(requestID, workflowID, componentName, moduleName) {
    const key = 'response';
    const path = '/ccpa/subtask/' + requestID + '?workflow_stage=' + workflowID;
    return this.http.get<any>(environment.apiUrl + path)
      .pipe(map((res) => res[key]), shareReplay(1), catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getSubTaskByWorkflowID, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  verifyClientEmailID(requestID, componentName, moduleName) {
    const path = '/dsar/email/verify/' + requestID;
    return this.http.post<any>(environment.apiUrl + path, {})
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.verifyClientEmailID, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
    this.lokiService.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
  }

  viewClientsFileAttachments(activityID, componentName, moduleName){
    const path = '/dsar/file/' + activityID;
    return this.http.get<any>(environment.apiUrl + path, {})
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.viewClientsFileAttachments, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  getSubtaskFileAttachements(fileId,componentName, moduleName){
    const path = '/upload/file?id='+fileId;
    return this.http.get<any>(environment.apiUrl + path, {})
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.viewSubtaskFileAttachements, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  getClientsEmailAttachments(fileId, componentName, moduleName){
    const path = '/ccpa/file/email?email_activity_id=' + fileId;
    return this.http.get<any>(environment.apiUrl + path, {})
      .pipe(catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.viewClientsFileAttachments, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  getRejectionReason(): Observable<any> {
    return from([{id:1,reason:'Excessive request'},
                {id:2,reason:'Frivolous / unfounded request'},
                {id:3,reason:'Incomplete / partial request'},
                {id:4,reason:'No response verification'},
                {id:5,reason:'Not a privacy related request'},
                {id:6,reason:'Non-EU request'},
                {id:7,reason:'Repetitive request'}]);
  }

  rejectDSARRequest(requestID, requestObj, componentName,moduleName){
    const path = '/ccpa/activity/reject/' + requestID;
    return this.http.put<any>(environment.apiUrl + path, requestObj)
      .pipe(shareReplay(1), catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.rejectDSARRequest, componentName, moduleName, path);
        return throwError(error);
      }));

  }

}
