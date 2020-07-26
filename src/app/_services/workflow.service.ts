import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  public workflowSource = new BehaviorSubject<any>('');
  selectedWorkflow = this.workflowSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  
  getWorkflow(pageLimit?): Observable<any> {
    const pgLimit = pageLimit !== undefined ? pageLimit : '';
    if(pageLimit === ''){
      return this.httpClient.get<any>(environment.apiUrl + '/workflow');
    } else{
      return this.httpClient.get<any>(environment.apiUrl + '/workflow' + pgLimit);
    }
    
  }

  // to get all stages
  getWorkflowById(id?, pageLimit?): Observable<any> {
    const pgLimit = pageLimit !== undefined ? pageLimit : '';
    if(pgLimit === ''){
      return this.httpClient.get<any>(environment.apiUrl + '/workflow?workflow_id='+id);//.pipe(delay(2000));
     } else {
      return this.httpClient.get<any>(environment.apiUrl + '/workflow?workflow_id='+id + pgLimit);//.pipe(delay(2000));
     }

  }

  createWorkflow(reqObj): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + '/workflow',reqObj);
  }

  updateWorkflow(id,reqObj): Observable<any> {
    return this.httpClient.put<any>(environment.apiUrl + '/workflow?workflow_id='+id,reqObj);
  }

  changeCurrentSelectedWorkflow(currentItem) {
    this.workflowSource.next(currentItem);
  }  
}
