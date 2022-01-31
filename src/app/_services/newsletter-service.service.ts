

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {apiConstant} from '../_constant/api.constant';
import {catchError, map} from 'rxjs/operators';
import {LokiService} from './loki.service';
import {LokiFunctionality, LokiStatusType} from '../_constant/loki.constant';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {OrganizationService} from './organization.service';
import { ActivatedRoute } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class NewsletterServiceService {
  private consentSolutionData = new BehaviorSubject(null);
  public consentSolutionDetails = this.consentSolutionData.asObservable();
  currentManagedOrgID: any;
  currrentManagedPropID: any;
  queryOID;
  queryPID;

  constructor(private http: HttpClient,
              private activateRoute: ActivatedRoute,
              private orgservice: OrganizationService,
              private loki: LokiService) {
    this.activateRoute.queryParamMap
      .subscribe(params => {
        this.queryOID = params.get('oid');
        this.queryPID = params.get('pid');
      });
    this.onGetPropsAndOrgId();
  }

  onGetPropsAndOrgId() {
    this.orgservice.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.currentManagedOrgID = response.organization_id || response.response.oid || this.queryOID;
        this.currrentManagedPropID = response.property_id || response.response.id || this.queryPID;
      } else {
        this.currentManagedOrgID = this.queryOID;
        this.currrentManagedPropID = this.queryPID;
      }
    });
  }
  onSubmitNewsLetterData(payload, publishType, componentName, moduleName): Observable<any> {
    let path = apiConstant.NEWS_LETTER_CONFIG.replace(':oid', this.currentManagedOrgID);
    path = path.replace(':pid', this.currrentManagedPropID);
    return this.http.post(environment.apiUrl + path, payload, {params: {publishType}}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieBanner, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }
  onGetNewsLetterData(componentName, moduleName): Observable<any> {
    let path = apiConstant.NEWS_LETTER_CONFIG.replace(':oid', this.currentManagedOrgID);
    path = path.replace(':pid', this.currrentManagedPropID);
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieBanner, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }
  onUpdateNewsLetterData(payload, publishType, componentName, moduleName): Observable<any> {
    let path = apiConstant.NEWS_LETTER_CONFIG.replace(':oid', this.currentManagedOrgID);
    path = path.replace(':pid', this.currrentManagedPropID);
    return this.http.put(environment.apiUrl + path, payload, {params: {publishType}}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieBanner, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }
  onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
    this.loki.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
  }
}
