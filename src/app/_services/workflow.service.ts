import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  constructor(private httpClient: HttpClient) { }

  
  getWorkflow(): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + '/workflow');
  }
}
