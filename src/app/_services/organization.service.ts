import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment.staging';
import { Orglist } from './../_models';
import { Router } from "@angular/router";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class OrganizationService {

    private currentOrgSubject: BehaviorSubject<Orglist>;
    public currentOrg: Observable<Orglist>;

    constructor(private http: HttpClient,
                private router:Router) {
        
        //this.currentOrgSubject = new BehaviorSubject<OrgList>(());
       // this.currentOrg = this.currentOrgSubject.asObservable();
    }

    public get currentOrgValue(): Orglist {
        return this.currentOrgSubject.value;
    }


    orglist(token, uid){
 // alert("in service");
// let testurl = environment.apiUrl+'/organisations/'+uid+'/'+isproperty;
// console.log('testurl ',testurl)

let httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token,
      })
  };

return this.http.get<any>(environment.apiUrl+'/organisations/'+uid+'/yes', httpOptions)
            
}

    

    
}