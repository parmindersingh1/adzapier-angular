import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DsarRequestService {
  subTasklist$: Observable<any[]>;
  constructor(private http: HttpClient) { }

  getDsarRequestList(orgId, propsID, pagelimit, orderBy?): Observable<any> {
    const path = '/ccpa/data/';
    return this.http.get(environment.apiUrl + path + orgId + '/' + propsID + pagelimit);
  }

  getDsarRequestFilter(orgId, propsID) {
    const path = '/ccpa/filter/';
    return this.http.get(environment.apiUrl + path + orgId + '/' + propsID);
  }

  getDsarRequestFilterList(orgId, propsID, pagelimit) {
    const path = '/ccpa/data/';
    return this.http.get(environment.apiUrl + path + orgId + '/' + propsID + pagelimit);
  }

  getDSARRequestDetails(orgID, propID, dataReqID): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/ccpa/data/' + orgID + '/' + propID + '/' + dataReqID);
  }

  getEmailTemplate(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/email/template');
  }

  // To update request details by id
  getDSARRequestDetailsByID(orgID, propID, dataReqID) {
    return this.http.get<any>(environment.apiUrl + '/ccpa/data/' + orgID + '/' + propID + '/' + dataReqID + '?edit_fields=true');
  }

  updateDSARRequestDetailsByID(orgID, propID, dataReqID, requestObj): Observable<any> {
    return this.http.put<any>(environment.apiUrl + '/ccpa/data/' + orgID + '/' + propID + '/' + dataReqID, requestObj);
  }

  addSubTask(requestID, stageID, requestObj) {
    return this.http.post<any>(environment.apiUrl + '/ccpa/subtask/' + requestID + '/' + stageID, requestObj);
  }

  updateSubTask(subtaskID, requestObj) {
    return this.http.put<any>(environment.apiUrl + '/ccpa/subtask/edit/' + subtaskID, requestObj);
  }

  addSubTaskResponse(taskID, requestObj) {
    return this.http.put<any>(environment.apiUrl + '/ccpa/subtask/response/' + taskID, requestObj);
  }

  getSubTask(requestID, stageID, subtaskID?): Observable<any> {

    if (subtaskID) {
     // if (!this.subTasklist$) {
       return this.http.get<any>(environment.apiUrl + '/ccpa/subtask/' + requestID + '/' + stageID + '/' + subtaskID).pipe(shareReplay(1));
     // }
     // return this.subTasklist$;
    } else {
     return this.http.get<any>(environment.apiUrl + '/ccpa/subtask/' + requestID + '/' + stageID).pipe(shareReplay(1));
     // return this.subTasklist$;
    }

  }

  viewUserUploadedFile(requestID) {
    const key = 'response';
    return this.http.get<any>(environment.apiUrl + '/dsar/user/file/' + requestID).pipe(map((res) => res[key]), shareReplay(1));
  }

  getSubTaskByWorkflowID(requestID, workflowID) {
    const key = 'response';
    return this.http.get<any>(environment.apiUrl + '/ccpa/subtask/' + requestID + '?workflow_stage=' + workflowID)
    .pipe(map((res) => res[key]), shareReplay(1));
  }

}
