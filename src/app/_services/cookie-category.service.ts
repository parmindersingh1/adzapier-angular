import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {OrganizationService} from './index';
import {LokiService} from './loki.service';
import {apiConstant} from '../_constant/api.constant';
import {catchError, map} from 'rxjs/operators';
import {LokiFunctionality, LokiStatusType} from '../_constant/loki.constant';
import {Observable, throwError} from 'rxjs';
interface CreateCookie {
  response: [];
}
@Injectable({
  providedIn: 'root'
})
export class CookieCategoryService  {
  primaryKeys: string[] = ['id'];
  currentManagedOrgID: any;
  currrentManagedPropID: any;
  constructor(private http: HttpClient,
              private loki: LokiService,
              private orgservice: OrganizationService) {
    this.onGetPropsAndOrgId();
  }
  onGetPropsAndOrgId() {
    this.orgservice.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.currentManagedOrgID = response.organization_id;
        this.currrentManagedPropID = response.property_id;
      } else {
        const orgDetails = this.orgservice.getCurrentOrgWithProperty();
        this.currentManagedOrgID = orgDetails.organization_id;
        this.currrentManagedPropID = orgDetails.property_id;
      }
    });
  }

  getCookieData(requestMeta, componentName): Observable<any>  {
    let path = apiConstant.COOKIE.replace(':orgId', this.currentManagedOrgID);
    path = path.replace(':propId', this.currrentManagedPropID);
    return this.http.get(environment.apiUrl + path, { params: requestMeta}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookie, componentName, path);
        return throwError(error);
      }),
    );
  }

   post(item: any, componentName): Observable<any>   {
     let path = apiConstant.COOKIE.replace(':orgId', this.currentManagedOrgID);
     path = path.replace(':propId', this.currrentManagedPropID);
     return this.http.post(environment.apiUrl + path, item).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookie, componentName, path);
        return throwError(error);
      }),
    );
  }
  //
  put(catData: any, id: any, componentName): Observable<any>  {
    let path = apiConstant.COOKIE_WITH_ID.replace(':orgId', this.currentManagedOrgID);
    path = path.replace(':propId', this.currrentManagedPropID);
    path = path.replace(':id', id);
    return this.http.put(environment.apiUrl + path, catData).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookie, componentName, path);
        return throwError(error);
      }),
    );
  }

  delete(item: any, componentName): Observable<any>  {
    let path = apiConstant.COOKIE_WITH_ID.replace(':orgId', this.currentManagedOrgID);
    path = path.replace(':propId', this.currrentManagedPropID);
    path = path.replace(':id', item.id);
    return this.http.patch(environment.apiUrl + path, {active: false}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookie, componentName, path);
        return throwError(error);
      }),
    );
  }

  createCategory(categoryData: { name: any; description: any }, componentName): Observable<any>  {
    const path = apiConstant.COOKIE_CATEGORY;
    return this.http.post(environment.apiUrl + path, categoryData).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieCategory, componentName, path);
        return throwError(error);
      }),
    );
  }
  //
  getCategoriesList(componentName): Observable<any> {
    const path = apiConstant.COOKIE_CATEGORY;
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
        catchError(error => {
          this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieCategory, componentName, path);
          return throwError(error);
        }),
      );
  }

  cookieScanning(componentName) {
    let path = apiConstant.COOKIE_SCANNER.replace(':orgId', this.currentManagedOrgID);
    path = path.replace(':propId', this.currrentManagedPropID);
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieCategory, componentName, path);
        return throwError(error);
      }),
    );
  }


  onSendLogs(errorType, msg, functionality, componentName, path) {
    this.loki.onSendErrorLogs(errorType, msg, functionality, componentName, path).subscribe();
  }
}
