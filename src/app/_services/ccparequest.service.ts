import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.develop';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CcparequestService {

  constructor(private httpClient: HttpClient) { }

  getCCPAdefaultRequestSubjectType(orgId): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + '/ccpa/default/types/' + orgId );
  }

  getCCPAdefaultConfigLabels(orgId) {
    return this.httpClient.get<any>(environment.apiUrl + '/ccpa/default/config/' + orgId );
  }

}
