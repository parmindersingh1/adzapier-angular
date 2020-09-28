import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  public workflowSource = new BehaviorSubject<any>('');
  selectedWorkflow = this.workflowSource.asObservable();
  private workflowlist$: Observable<any>;

  constructor(private httpClient: HttpClient) { }

  //for workflow table
  getWorkflow(pageLimit?): Observable<any> {
    const key = 'response';
    const pgLimit = pageLimit !== undefined ? pageLimit : '';
    if (pageLimit === '') {
    //  if (!this.workflowlist$) {
        return this.httpClient.get<any>(environment.apiUrl + '/workflow').pipe(shareReplay(1)); // map(res => res[key])
     // }
     // return this.workflowlist$;
    } else {
     // if (!this.workflowlist$) {
       return this.httpClient.get<any>(environment.apiUrl + '/workflow' + pgLimit)
        .pipe(shareReplay(1)); // map(res => res[key]),
    //  }
    //  return this.workflowlist$;
    }

  }

  getWorkflowByStatus(status): Observable<any> {
    if(!this.workflowlist$){
      this.workflowlist$ = this.httpClient.get<any>(environment.apiUrl + '/workflow?workflow_status=' + status).pipe(shareReplay(1));
    }
    return this.workflowlist$;
  }

  // to get all stages
  getWorkflowById(id?, pageLimit?): Observable<any> {
    const key = 'response';
    const pgLimit = pageLimit !== undefined ? pageLimit : '';
    if (pgLimit === '') {
      return this.httpClient.get<any>(environment.apiUrl + '/workflow?workflow_id=' + id)
      .pipe(map(res => res[key]), shareReplay(1));
    } else {
      return this.httpClient.get<any>(environment.apiUrl + '/workflow?workflow_id=' + id + pgLimit)
      .pipe(map(res => res[key]), shareReplay(1));
    }

  }

  createWorkflow(reqObj): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + '/workflow', reqObj);
  }

  updateWorkflow(id, reqObj): Observable<any> {
    return this.httpClient.put<any>(environment.apiUrl + '/workflow?workflow_id=' + id, reqObj);
  }

  changeCurrentSelectedWorkflow(currentItem) {
    this.workflowSource.next(currentItem);
  }
}

