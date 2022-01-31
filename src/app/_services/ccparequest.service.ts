import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CcparequestService {
  cacheRequestSubjectType: any;
  constructor(private httpClient: HttpClient) { }

  getCCPAdefaultRequestSubjectType(): Observable<any> {
    const key = 'response';
    if(this.cacheRequestSubjectType){
      return of(this.cacheRequestSubjectType);
    }
    return this.httpClient.get<any>(environment.apiUrl + '/ccpa/default/types')
    .pipe(map(res => this.cacheRequestSubjectType = res[key]));
  }

  getCCPAdefaultConfigLabels(orgId) {
    return this.httpClient.get<any>(environment.apiUrl + '/ccpa/default/config/' + orgId );
  }

  clearCacheRequestSubjectType(){
    this.cacheRequestSubjectType = null;
  }
}
