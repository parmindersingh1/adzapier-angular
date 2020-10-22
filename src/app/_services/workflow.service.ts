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

  //for workflow table
  getWorkflow(componentName, moduleName, pageLimit?): Observable<any> {
    const key = 'response';
    const pgLimit = pageLimit !== undefined ? pageLimit : '';
    const path = apiConstant.WORKFLOW;
    if (pageLimit === '') {
    //  if (!this.workflowlist$) {
        return this.httpClient.get<any>(environment.apiUrl + path).pipe(shareReplay(1),
        catchError(error => {
          this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWorkflow, componentName, moduleName, path);
          return throwError(error);
        })); // map(res => res[key])
     // }
     // return this.workflowlist$;
    } else {
     // if (!this.workflowlist$) {
       return this.httpClient.get<any>(environment.apiUrl + apiConstant.WORKFLOW + pgLimit)
        .pipe(shareReplay(1)); // map(res => res[key]),
    //  }
    //  return this.workflowlist$;
    }

  }
// https://develop-cmp-api.adzpier-staging.com/api/v1/workflow?workflow_status=active

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
  getWorkflowById(componentName, moduleName, id?, pageLimit?): Observable<any> {
    const key = 'response';
    const pgLimit = pageLimit !== undefined ? pageLimit : '';
    const path = apiConstant.WORKFLOW_ID;
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

  changeCurrentSelectedWorkflow(currentItem) {
    this.workflowSource.next(currentItem);
  }

  getActiveWorkflowList(componentName, moduleName): Observable<any> {
    const path = '/workflow?workflow_status=active';

    return this.httpClient.get<any>(environment.apiUrl + path).pipe(
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.createWorkflow, componentName, moduleName, path);
        return throwError(error);
      }));
    // https://develop-cmp-api.adzpier-staging.com/api/v1/workflow?workflow_status=active

  }

  onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
    this.lokiService.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
  }
}

