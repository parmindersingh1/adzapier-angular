import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.staging';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CcparequestService {

  constructor(private httpClient: HttpClient) { }

  getCCPAdefaultRequestSubjectType(): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + '/ccpa/default/types');
  }

  getCCPAdefaultConfigLabels(orgId) {
    return this.httpClient.get<any>(environment.apiUrl + '/ccpa/default/config/' + orgId );
  }

}
