import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
export class CookieCategoryService {
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
        this.currentManagedOrgID = response.organization_id || response.response.oid;
        this.currrentManagedPropID = response.property_id || response.response.id;
      } else {
        const orgDetails = this.orgservice.getCurrentOrgWithProperty();
        this.currentManagedOrgID = orgDetails.organization_id;
        this.currrentManagedPropID = orgDetails.property_id;
      }
    });
  }

  getCookieData(requestMeta, componentName, moduleName): Observable<any> {
    let path = apiConstant.COOKIE.replace(':orgId', this.currentManagedOrgID);
    path = path.replace(':propId', this.currrentManagedPropID);
    return this.http.get(environment.apiUrl + path, {params: requestMeta}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookie, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  getScanningData(requestMeta, componentName, moduleName): Observable<any> {
    let path = apiConstant.COOKIE_SCAN_JOBS.replace(':orgId', this.currentManagedOrgID);
    path = path.replace(':propId', this.currrentManagedPropID);
    return this.http.get(environment.apiUrl + path, {params: requestMeta}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookie, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  getLastScanningData(componentName, moduleName): Observable<any> {
    let path = apiConstant.COOKIE_LAST_SCANNING_DATA;
    path = path.replace(':propId', this.currrentManagedPropID);
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookie, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  post(item: any, componentName, moduleName): Observable<any> {
    let path = apiConstant.COOKIE.replace(':orgId', this.currentManagedOrgID);
    path = path.replace(':propId', this.currrentManagedPropID);
    return this.http.post(environment.apiUrl + path, item).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookie, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  //
  put(catData: any, id: any, componentName, moduleName): Observable<any> {
    let path = apiConstant.COOKIE_WITH_ID.replace(':orgId', this.currentManagedOrgID);
    path = path.replace(':propId', this.currrentManagedPropID);
    path = path.replace(':id', id);
    return this.http.put(environment.apiUrl + path, catData).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookie, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  delete(item: any, componentName, moduleName): Observable<any> {
    let path = apiConstant.COOKIE_WITH_ID.replace(':orgId', this.currentManagedOrgID);
    path = path.replace(':propId', this.currrentManagedPropID);
    path = path.replace(':id', item.id);
    return this.http.patch(environment.apiUrl + path, {active: false}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookie, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  createCategory(categoryData: { name: any; description: any }, componentName, moduleName): Observable<any> {
    const path = apiConstant.COOKIE_CATEGORY;
    return this.http.post(environment.apiUrl + path, categoryData).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieCategory, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  //
  getCategoriesList(componentName, moduleName): Observable<any> {
    const path = apiConstant.COOKIE_CATEGORY;
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieCategory, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  cookieScanning(componentName, moduleName) {
    let path = apiConstant.COOKIE_SCANNER.replace(':orgId', this.currentManagedOrgID);
    path = path.replace(':propId', this.currrentManagedPropID);
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieCategory, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  publishCookieCategory(componentName, moduleName) {
    let path = apiConstant.COOKIE_PUBLISH.replace(':orgId', this.currentManagedOrgID);
    path = path.replace(':propId', this.currrentManagedPropID);
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieCategory, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }


  onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
    this.loki.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
  }

  getCategoryChatData(componentName, moduleName) {
    const path = apiConstant.COOKIE_CATEGORY_CHART.replace(':propId', this.currrentManagedPropID);
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(err => {
        this.onSendLogs(LokiStatusType.ERROR, err, LokiFunctionality.cookieCategory, componentName, moduleName, path);
        return throwError(err);
      })
    );
  }

  getAllCookieForCsv(componentName, moduleName) {
    let path = apiConstant.COOKIE_CATEGORY_ALL_RECORD.replace(':orgId', this.currentManagedOrgID);
    path = path.replace(':propId', this.currrentManagedPropID);
    return this.http.get(environment.apiUrl + path).pipe(map(res => {
        return  {
          res,
          propID: this.currrentManagedPropID
        };
      }),
      catchError(err => {
        this.onSendLogs(LokiStatusType.ERROR, err, LokiFunctionality.cookieCategory, componentName, moduleName, path);
        return throwError(err);
      })
    );
  }

  getPartyChartData(componentName, moduleName) {
    const path = apiConstant.COOKIE_CATEGORY_TYPE_CHART.replace(':propId', this.currrentManagedPropID);
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(err => {
        this.onSendLogs(LokiStatusType.ERROR, err, LokiFunctionality.cookieCategory, componentName, moduleName, path);
        return throwError(err);
      })
    );
  }

  getSubscrptionData(componentName, moduleName) {
    const path = apiConstant.COOKIE_CATEGORY_AVALIBLE.replace(':propId', this.currrentManagedPropID).replace(':orgId', this.currentManagedOrgID);
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(err => {
        this.onSendLogs(LokiStatusType.ERROR, err, LokiFunctionality.cookieCategory, componentName, moduleName, path);
        return throwError(err);
      })
    );
  }

  getCookieCategoriesStatus(componentName, moduleName) {
    let path = apiConstant.COOKIE_SCANNER_STATUS.replace(':orgId', this.currentManagedOrgID);
    path = path.replace(':propId', this.currrentManagedPropID);
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieCategory, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

}
