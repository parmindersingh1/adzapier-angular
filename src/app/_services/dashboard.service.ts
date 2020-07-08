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
}