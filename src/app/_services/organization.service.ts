import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from './../../environments/environment.staging';
import { Orglist } from './../_models';
import { Organization } from '../_models/organization';

@Injectable({ providedIn: 'root' })

export class OrganizationService {

    private currentOrgSubject: BehaviorSubject<Orglist>;
    public currentOrg: Observable<Orglist>;
    @Output() emitUpdatedOrgList: EventEmitter<Orglist> = new EventEmitter<Orglist>();
    @Output() emitUpdatedOrganization: EventEmitter<any> = new EventEmitter<any>();
    @Output() getSelectedOrgProperty: EventEmitter<any> = new EventEmitter<any>();
    @Output() getOrganization: EventEmitter<any> = new EventEmitter<any>();
    constructor(private http: HttpClient) { }

    public get currentOrgValue(): Orglist {
        return this.currentOrgSubject.value;
    }


    orglist(): Observable<Organization[]> {
        return this.http.get<Organization[]>(environment.apiUrl + '/organizations?include_property=1');
    }

    viewOrganizationDetails(orgId): Observable<Organization[]> {
        return this.http.get<Organization[]>(environment.apiUrl + '/organizations/' + orgId);
    }

    updateOrganization(orgId, data): Observable<any> {
        return this.http.put<any>(environment.apiUrl + '/organizations/' + orgId, data);
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
