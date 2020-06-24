import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.develop';
@Injectable({
  providedIn: 'root'
})
export class CcpadataService {

  constructor(private httpClient: HttpClient) { }

  createCCPAData(orgID, propID, crID, dataObj) {
    return this.httpClient.post<any>(environment.apiUrl + '/ccpa/data/' + orgID + '/' + propID + '/' + crID, dataObj);
  }
}
