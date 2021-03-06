import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {apiConstant} from '../_constant/api.constant';
import {catchError, map} from 'rxjs/operators';
import {LokiService} from './loki.service';
import {LokiFunctionality, LokiStatusType} from '../_constant/loki.constant';
import {BehaviorSubject, throwError} from 'rxjs';
import {OrganizationService} from './organization.service';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConsentSolutionsService {
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
        this.currentManagedOrgID =  this.queryOID;
        this.currrentManagedPropID = this.queryPID;
      }
    });
  }

  getConsentRecord(componentName, moduleName, pageLimit, pid: string) {
    const path = apiConstant.GET_CONSENT_RECORDS.replace(':pid', pid);
    return this.http.get(environment.apiUrl + path, {params: pageLimit}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.billing, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
    this.loki.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
  }

  getLegalRecord(componentName, moduleName, pageLimit, pid: string) {
    const path = apiConstant.GET_LEGAL_RECORDS.replace(':pid', pid) + pageLimit;
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.billing, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  //Add Consent Record
  PutConsentRecord(componentName, moduleName, payload, pid: string) {
    const path = apiConstant.ADD_CONSENT.replace(':pid', pid);
    return this.http.post(environment.apiUrl + path, payload).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.billing, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  onPushConsentData(consentData) {
    return new Promise(resolve => {
      resolve(this.consentSolutionData.next(consentData));
    });
  }

  updateConsent(componentName, moduleName,  payload, id) {
    let path = apiConstant.UPDATE_CONSENT.replace(':pid', this.currrentManagedPropID);
    path = path.replace(':id', id);
    return this.http.put(environment.apiUrl + path, payload).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.billing, componentName, moduleName, path);
        return throwError(error);
      }));
  }


  // Dashboard

  getConsentDataForDashboard(componentName, params, moduleName) {
    const path = apiConstant.CONSENT_DASHBOARD.replace(':pid', this.currrentManagedPropID);
    return this.http.get(environment.apiUrl + path, {params}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.billing, componentName, moduleName, path);
        return throwError(error);
      }));
  }

  exportConsentCSv(pid, params) {
    const path = apiConstant.EXPORT_CONSENT.replace(':pid', pid)
    return  this.http.get(environment.apiUrl + path,
      {responseType: 'blob', params}
    );
  }

  exportConsentLegalNoticesCSv(pid, params) {
    const path = apiConstant.EXPORT_CONSENT_LEGAL_NOTICES.replace(':pid', pid)
    return  this.http.get(environment.apiUrl + path,
      {responseType: 'blob', params}
    );
  }

  exportConsentProofsCSv(pid, params) {
    const path = apiConstant.EXPORT_CONSENT_PROOFS.replace(':pid', pid)
    return  this.http.get(environment.apiUrl + path,
      {responseType: 'blob', params}
    );
  }

  exportConsentPreferenceCSv(pid, params) {
    const path = apiConstant.EXPORT_CONSENT_PREFERENCE.replace(':pid', pid)
    return  this.http.get(environment.apiUrl + path,
      {responseType: 'blob', params}
    );
  }
}
