import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CcpadataService {

  constructor(private httpClient: HttpClient) { }

  createCCPAData(orgID, propID, crID, dataObj) {
    return this.httpClient.post<any>(environment.apiUrl + '/ccpa/data/' + orgID + '/' + propID + '/' + crID, dataObj);
  }

  addCCPADataActivity(ccpaDataId, reqObj) {
    return this.httpClient.post<any>(environment.apiUrl + '/ccpa/activity/' + ccpaDataId, reqObj);
  }

  getCCPADataActivityLog(ccpaDataId,pageLimit?): Observable<any>{
    if(pageLimit !== undefined){
      return this.httpClient.get<any>(environment.apiUrl + '/ccpa/activity/' + ccpaDataId + pageLimit);
    } else {
      return this.httpClient.get<any>(environment.apiUrl + '/ccpa/activity/' + ccpaDataId);
    }
  }
  
  addCCPADataEmailActivity(ccpaDataId, reqObj) {
    return this.httpClient.post<any>(environment.apiUrl + '/ccpa/email/' + ccpaDataId, reqObj); 
  }

  getCCPADataEmailLog(ccpaDataId): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + '/ccpa/email/' + ccpaDataId);
  }

}