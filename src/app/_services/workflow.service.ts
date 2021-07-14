import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { shareReplay, map, catchError } from 'rxjs/operators';
import {LokiService} from './loki.service';
import {LokiFunctionality, LokiStatusType} from '../_constant/loki.constant';
import {apiConstant} from '../_constant/api.constant';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  public workflowSource = new BehaviorSubject<any>('');
  selectedWorkflow = this.workflowSource.asObservable();
  private workflowlist$: Observable<any>;

  constructor(private httpClient: HttpClient, private lokiService: LokiService) { }

  getWorkflow(componentName, moduleName, orgid, pageLimit?, orderBy?): Observable<any> {
    const key = 'response';
    const pgLimit = pageLimit !== undefined ? pageLimit : '';
    const path = apiConstant.WORKFLOW + '/' + orgid;
    if (pageLimit === '') {
    //  if (!this.workflowlist$) {
        return this.httpClient.get<any>(environment.apiUrl + path).pipe(shareReplay(1),
        catchError(error => {
          this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflow, componentName, moduleName, path);
          return throwError(error);
        })); // map(res => res[key])
     // }
     // return this.workflowlist$;
    } else if(orderBy !== undefined){
      return this.httpClient.get<any>(environment.apiUrl + path + pgLimit + orderBy)
      .pipe(shareReplay(1));
    }else {
     // if (!this.workflowlist$) {
       return this.httpClient.get<any>(environment.apiUrl + path + pgLimit)
        .pipe(shareReplay(1)); // map(res => res[key]),
    //  }
    //  return this.workflowlist$;
    }

  }

  getWorkflowByStatus(status, componentName, moduleName): Observable<any> {
    const path = apiConstant.WORKFLOW_STATUS;
    if(!this.workflowlist$){
      this.workflowlist$ = this.httpClient.get<any>(environment.apiUrl + path + status).pipe(shareReplay(1),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflowByStatus, componentName, moduleName, path);
        return throwError(error);
      })
      );
    }
    return this.workflowlist$;
  }

  // to get all stages
  getWorkflowById(componentName, moduleName, orgid, id?, pageLimit?): Observable<any> {
    const key = 'response';
    const pgLimit = pageLimit !== undefined ? pageLimit : '';
    const path = apiConstant.WORKFLOW_ORGID_WORKFLOW_ID.replace(':orgid', orgid); //'/workflow/'+orgid+'?workflow_id='; 
    if (pgLimit === '') {
      return this.httpClient.get<any>(environment.apiUrl + path + id)
      .pipe(map(res => res[key]), shareReplay(1),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflowById, componentName, moduleName, path);
        return throwError(error);
      })
      );
    } else {
      return this.httpClient.get<any>(environment.apiUrl + path + id + pgLimit)
      .pipe(map(res => res[key]), shareReplay(1),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflowById, componentName, moduleName, path);
        return throwError(error);
      }));
    }

  }

  createWorkflow(componentName, moduleName, reqObj): Observable<any> {
    const path = apiConstant.WORKFLOW;
    return this.httpClient.post<any>(environment.apiUrl + path, reqObj).pipe(
    catchError(error => {
      this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.createWorkflow, componentName, moduleName, path);
      return throwError(error);
    }));
  }

  updateWorkflow(componentName, moduleName, id, reqObj): Observable<any> {
    const path = apiConstant.WORKFLOW_ID;
    return this.httpClient.put<any>(environment.apiUrl + path + id, reqObj).pipe(
    catchError(error => {
      this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.updateWorkflow, componentName, moduleName, path);
      return throwError(error);
    }));
  }

  //workflow/activate

  activateWorkflow(componentName, moduleName, id, reqObj): Observable<any> {
    const path = apiConstant.ACTIVATE_WORKFLOW + id;
    return this.httpClient.put<any>(environment.apiUrl + path, reqObj).pipe(
    catchError(error => {
      this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.activateWorkflow, componentName, moduleName, path);
      return throwError(error);
    }));
  }

  updateWorkflowName(componentName, moduleName, id,reqObj): Observable<any> {
    const path = apiConstant.UPDATE_WORKFLOW_NAME + id;
    return this.httpClient.put<any>(environment.apiUrl + path, reqObj).pipe(
    catchError(error => {
      this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.activateWorkflow, componentName, moduleName, path);
      return throwError(error);
    }));
  }

  changeCurrentSelectedWorkflow(currentItem) {
    this.workflowSource.next(currentItem);
  }

  getActiveWorkflowList(componentName, moduleName, orgid, pagelimit): Observable<any> {
    const path = '/workflow/'+ orgid +'?workflow_status=active' + pagelimit;

    return this.httpClient.get<any>(environment.apiUrl + path).pipe(
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.createWorkflow, componentName, moduleName, path);
        return throwError(error);
      }));

  }

  deleteWorkflowStage(componentName, moduleName, stageid, workflowid): Observable<any> {
    const path = '/workflow/stage/' + stageid + '/' + workflowid ;
    return this.httpClient.delete<any>(environment.apiUrl + path).pipe(
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.createWorkflow, componentName, moduleName, path);
        return throwError(error);
      }));

  }

  onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
    this.lokiService.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
  }
}

