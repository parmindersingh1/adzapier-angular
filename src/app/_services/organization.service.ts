import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment.staging';
import { Orglist } from './../_models';
import { Router } from '@angular/router';
import { OrgProperties } from '../_models/orgproperties';

@Injectable({ providedIn: 'root' })

export class OrganizationService {

    private currentOrgSubject: BehaviorSubject<Orglist>;
    public currentOrg: Observable<Orglist>;

    constructor(private http: HttpClient, private router: Router) { }

    public get currentOrgValue(): Orglist {
        return this.currentOrgSubject.value;
    }


    orglist(): Observable<any> {
        return this.http.get<any>(environment.apiUrl + '/organizations?include_property=1');
    }

    updateOrganization(orgId, data): Observable<any> {
        return this.http.put<any>(environment.apiUrl + '/organizations/' + orgId, {orgName: data});
    }

    addProperties(orgId, properties): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/property/' + orgId,  properties);
    }

    getPropertyList(orgId): Observable<any>{
        return this.http.get<any>(environment.apiUrl + '/property/' + orgId );
    }

    editProperties(orgId, propId, data): Observable<any> {
        return this.http.put<any>(environment.apiUrl + '/property/' + orgId + '/' + propId, data);
    }
}
