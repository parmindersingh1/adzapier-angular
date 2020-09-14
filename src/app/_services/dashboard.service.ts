import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }
  getCcpaAndDsar(orgId, propsID, queryParam): Observable<any> {
    const path = '/ccpa/request/chart/';
    return this.http.get(environment.apiUrl + path + orgId + '/' + propsID, { params : queryParam});
  }
  getRequestByState(orgId, propsID, queryParam): Observable<any> {
    const path = '/ccpa/chart/state/';
    return this.http.get(environment.apiUrl + path + orgId + '/' + propsID, { params : queryParam});
  }
  getDashboardData(propId) {
    const path = '/consentdashboard/';
    return this.http.get(environment.apiUrl + path + propId);
  }

  getOtpInActivity(propId) {
    return this.http.get(environment.apiUrl  + '/optinactivitydashboard/' + propId);
  }

  getOtpOutActivity(propId) {
    return this.http.get(environment.apiUrl  + '/optoutactivitydashboard/' + propId);
  }
  getConsentDetails(propId) {
    return this.http.get(environment.apiUrl  + '/consentdetailsdashboard/' + propId);
  }
}
