import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {apiConstant} from '../_constant/api.constant';
import {catchError, map} from 'rxjs/operators';
import {LokiService} from './loki.service';
import {LokiFunctionality, LokiStatusType} from '../_constant/loki.constant';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsentSolutionsService {

  constructor(private http: HttpClient,
              private loki: LokiService) { }

  getConsentRecord(componentName, moduleName, pageLimit, pid: string) {
    const path = apiConstant.GET_CONSENT_RECORDS.replace(':pid',  pid) + pageLimit;
    return this.http.get(environment.apiUrl + path).pipe( map( res => res),
      catchError( error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.billing, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
    this.loki.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
  }

  getLegalRecord(componentName, moduleName, pageLimit, pid: string){
    const path = apiConstant.GET_LEGAL_RECORDS.replace(':pid',  pid) + pageLimit;
    return this.http.get(environment.apiUrl + path).pipe( map( res => res),
      catchError( error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.billing, componentName, moduleName, path);
        return throwError(error);
      }));
  }

}
