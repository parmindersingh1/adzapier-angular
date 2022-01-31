import { Injectable, EventEmitter, Output, Directive } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Orglist } from './../_models';
import { Organizationdetails } from '../_models/organizationdetails';
import { map, shareReplay } from 'rxjs/operators';

@Directive()
@Injectable({ providedIn: 'root' })

export class OrganizationService {

    private currentOrgSubject: BehaviorSubject<Orglist>;
    public currentOrg: Observable<Orglist>;
    @Output() emitUpdatedOrgList: EventEmitter<Orglist> = new EventEmitter<Orglist>();
    @Output() emitUpdatedOrganization: EventEmitter<any> = new EventEmitter<any>();
    @Output() getSelectedOrgProperty: EventEmitter<any> = new EventEmitter<any>();
    @Output() getOrganization: EventEmitter<any> = new EventEmitter<any>();
    public currentPropertySource = new BehaviorSubject<any>('');
    currentProperty = this.currentPropertySource.asObservable();

    public currentManageOrganizationSource = new BehaviorSubject<any>('');
    currentOrganization = this.currentManageOrganizationSource.asObservable();

    public editedOrganizationSource = new BehaviorSubject<any>('');
    editedOrganization = this.editedOrganizationSource.asObservable();

    public editedPropertySource = new BehaviorSubject<any>('');
    editedProperty = this.editedPropertySource.asObservable();

    public isOrganizationUpdated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isPropertyUpdated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

    constructor(private http: HttpClient) { }

    public get currentOrgValue(): Orglist {
        return this.currentOrgSubject.value;
    }


    addOrganization(reqObj): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/organizations', reqObj);
    }

    orglist(params?): Observable<any> {
        if (params) {
            return this.http.get<any>(environment.apiUrl + '/organizations' + params);
        }
        return this.http.get<any>(environment.apiUrl + '/organizations');
    }

    searchOragnization(companyID,searchText): Observable<any> {
        return this.http.get<any>(environment.apiUrl + '/organizationsbyname/' + companyID + '?name='+searchText);
    }

    viewOrganizationDetails(orgId): Observable<Organizationdetails[]> {
        return this.http.get<Organizationdetails[]>(environment.apiUrl + '/organizations/' + orgId);
    }

    updateOrganization(orgId, data): Observable<any> {
        return this.http.put<any>(environment.apiUrl + '/organizations/' + orgId, data);
    }

    addProperties(orgId, properties): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/property/' + orgId,  properties);
    }

    getPropertyList(orgId, pageLimit?): Observable<any> {
        const pgLimit = pageLimit !== undefined ? pageLimit : '';
        return this.http.get<any>(environment.apiUrl + '/property/' + orgId + pgLimit );
    }

    editProperties(orgId, propId, data): Observable<any> {
        return this.http.put<any>(environment.apiUrl + '/property/' + orgId + '/' + propId, data);
    }

    changeCurrentSelectedProperty(currentItem) {
        this.currentPropertySource.next(currentItem);
    }

    getCompanyDetails(): Observable<any> {
        return this.http.get<any>(environment.apiUrl + '/company');
    }

    getOrganizationByID(orgID): Observable<any> {
        return this.http.get<any>(environment.apiUrl + '/organizations/' + orgID);
    }

    changeCurrentManagedOrganization(currentItem) {
        this.currentManageOrganizationSource.next(currentItem);
    }

    getOrganizationWithProperty(): Observable<any> {
        return this.http.get<any>(environment.apiUrl + '/organizations?required=property').pipe(map(res => res));
    }

    setCurrentOrgWithProperty(currentOrg) {
        localStorage.setItem('currentOrg', JSON.stringify(currentOrg));
    }

    updateCurrentOrgwithProperty(updatedItem) {
        const selectedOrgProperty = JSON.parse(localStorage.getItem('currentOrg'));
        selectedOrgProperty.organization_name = updatedItem.organization_name;
        selectedOrgProperty.property_id = updatedItem.property_id;
        selectedOrgProperty.property_name = updatedItem.property_name;
        localStorage.setItem('currentOrg', JSON.stringify(selectedOrgProperty));
    }

    getCurrentOrgWithProperty() {
        if (localStorage.getItem('currentOrg') !== null) {
            return JSON.parse(localStorage.getItem('currentOrg'));
          }
    }

    removeControls() {
        return localStorage.removeItem('currentOrg');
    }

    disableProperty(orgID, propID): Observable<any> {
        return this.http.patch<any>(environment.apiUrl + '/property/' + orgID + '/' + propID, {});
    }

    getOrgTeamMembers(orgID, pagelimit?): Observable<any> {
      //  const key = 'response';
        if (pagelimit !== undefined) {
            return this.http.get<any>(environment.apiUrl + '/team_member' + '?orgid=' + orgID + pagelimit)
            .pipe(shareReplay());
        } else {
            return this.http.get<any>(environment.apiUrl + '/team_member' + '?orgid=' + orgID)
            .pipe(shareReplay());
        }

    }

    disableOrganization(orgID, reqObj): Observable<any> {
        return this.http.patch<any>(environment.apiUrl + '/organizations/' + orgID, reqObj);
    }

    updateEditedProperty(currentItem) {
        this.editedPropertySource.next(currentItem);
    }

    updateEditedOrganization(currentItem) {
        this.editedOrganizationSource.next(currentItem);
    }

    getOrganizationLicenseNameByID(orgID,licenseID): Observable<any>{
        return this.http.get<any>(environment.apiUrl + '/organizations/' + orgID + '/' + licenseID)
        .pipe(shareReplay());
    }
}
