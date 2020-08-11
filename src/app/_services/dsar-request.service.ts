import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DsarRequestService {
  subTasklist$: Observable<any[]>;
  constructor(private http: HttpClient) { }

  getDsarRequestList(orgId, propsID, pagelimit): Observable<any> {
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
    return this.http.get<any>(environment.apiUrl + '/ccpa/data/' + orgID + '/' + propID + '/' + dataReqID).pipe(shareReplay(1))
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
      if (!this.subTasklist$) {
        this.subTasklist$ = this.http.get<any>(environment.apiUrl + '/ccpa/subtask/' + requestID + '/' + stageID + '/' + subtaskID).pipe(shareReplay(1));
      }
      return this.subTasklist$;
    }
    else {
      this.subTasklist$ = this.http.get<any>(environment.apiUrl + '/ccpa/subtask/' + requestID + '/' + stageID).pipe(shareReplay(1));
      return this.subTasklist$;
    }

  }

}
