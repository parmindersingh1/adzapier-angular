import { Injectable } from '@angular/core';
import { HttpClient, HttpInterceptor } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment.staging';
import { Orglist } from './../_models';
import { Router } from '@angular/router';

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
}
