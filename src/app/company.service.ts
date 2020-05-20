import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.develop';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private httpClient: HttpClient) { }

  getCompanyDetails(): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + '/company');
  }

  updateCompanyDetails(reqestObj): Observable<any> {
    return this.httpClient.put<any>(environment.apiUrl + '/company', reqestObj);
  }

  getCompanyTeamMembers(): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + '/team_member');
  }

  inviteUser(reqestObj): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + '/invite-user' , reqestObj);
  }

}

