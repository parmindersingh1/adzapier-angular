import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CcparequestService {

  constructor(private httpClient: HttpClient) { }

  getCCPAdefaultRequestSubjectType(): Observable<any> {
    const key = 'response';
    return this.httpClient.get<any>(environment.apiUrl + '/ccpa/default/types').pipe(map(res => res[key]), shareReplay());
  }

  getCCPAdefaultConfigLabels(orgId) {
    return this.httpClient.get<any>(environment.apiUrl + '/ccpa/default/config/' + orgId );
  }

}
