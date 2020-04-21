import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.staging';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CCPAFormConfigurationService {

  constructor(private httpClient: HttpClient) { }

  createCCPAForm(orgId, propId, formObject) {
    return this.httpClient.post<any>(environment.apiUrl + 'ccpa/form/' + orgId + '/' + propId, formObject);
  }
  // return this.httpClient.get<any>(environment.apiUrl + '/ccpa/default/config/' + orgId );
  // http://staging-cmp-api.adzpier.com/api/v1/ccpa/form/7fc034da-ce88-4833-8c73-ecc22aac8135/0389b1c6-932f-4f6d-8a37-47978069298f

  getCCPAFormList(orgId, propId): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + 'ccpa/form/' + orgId + '/' + propId);
  }

  // http://staging-cmp-api.adzpier.com/api/v1/ccpa/form/7fc034da-ce88-4833-8c73-ecc22aac8135/0389b1c6-932f-4f6d-8a37-47978069298f



}
