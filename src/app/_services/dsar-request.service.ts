import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from './../../environments/environment.staging';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DsarRequestService {

  constructor(private http: HttpClient) { }

  getDsarRequestList(orgId, propsID, pagelimit): Observable<any> {
    const path = '/ccpa/data/';
    return this.http.get(environment.apiUrl + path + orgId + '/' + propsID + pagelimit);
  }
  getDsarRequestFilter(orgId, propsID) {
    const path = '/ccpa/filter/';
    return this.http.get(environment.apiUrl + path + orgId + '/' + propsID);
  }
  getDsarRequestFilterList(orgId, propsID, pagelimit) {
    const path = '/ccpa/data/';
    return this.http.get(environment.apiUrl + path + orgId + '/' + propsID + pagelimit);
  }

  getDSARRequestDetails(orgID, propID, dataReqID): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/ccpa/data/' + orgID + '/' + propID + '/' + dataReqID);
  }
// http://develop-cmp-api.adzpier.com/api/v1/ccpa/data/q/q/q
}
