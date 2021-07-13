import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {LokiService} from './loki.service';
import {LokiFunctionality, LokiStatusType} from '../_constant/loki.constant';
import {apiConstant} from '../_constant/api.constant';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CookieBannerService {

  constructor(private http: HttpClient, private loki: LokiService) {
  }

  onSubmitCookieBannerData(payload, orgId, propId, componentName, moduleName): Observable<any> {
    let path = apiConstant.CONSENT_BANNER.replace(':orgId', orgId);
    path = path.replace(':propId', propId);
    return this.http.post(environment.apiUrl + path, payload).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieBanner, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  onUpdateCookieBannerData(payload, orgId, propId, componentName, moduleName): Observable<any> {
    let path = apiConstant.CONSENT_BANNER.replace(':orgId', orgId);
    path = path.replace(':propId', propId);
    return this.http.put(environment.apiUrl + path, payload).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieBanner, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  onGetPlanType(componentName, moduleName): Observable<any> {
    const path = apiConstant.COMPANY_SERVICE;
    return this.http.get(environment.apiUrl + path)
      .pipe(map(res => res),
        catchError(error => {
          this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieBanner, componentName, moduleName, path);
          return throwError(error);
        }),
      );
  }

  onGetCookieBannerData(orgId, propId, componentName, moduleName): Observable<any> {
    let path = apiConstant.CONSENT_BANNER.replace(':orgId', orgId);
    path = path.replace(':propId', propId);
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieBanner, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
    this.loki.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
  }

  updateVendors(payloads, orgId, propId, componentName, moduleName): Observable<any> {
    let path = apiConstant.UPDATE_VENDORS.replace(':orgId', orgId);
    path = path.replace(':propId', propId);
    return this.http.post(environment.apiUrl + path, payloads).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieBanner, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  onGetVendorsData(orgId, propId, componentName, moduleName): Observable<any> {
    let path = apiConstant.UPDATE_VENDORS.replace(':orgId', orgId);
    path = path.replace(':propId', propId);
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieBanner, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  GetGlobleLangData(lang) {
    const url = environment.globleLangURL.replace(':lang', lang);
    return this.http.get(url);
  }

  GetCustomLangData(componentName, moduleName, lang, oid, pid) {
    let url = apiConstant.COOKIE_BANNER_GET_LANG_FROM_DB.replace(':lang', lang);
    url = url.replace(':orgId', oid);
    url = url.replace(':propId', pid);
    return this.http.get(environment.apiUrl + url).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieBanner, componentName, moduleName, url);
        return throwError(error);
      }),
    );
  }

  saveCustomLang(payloads, lang, orgId, propId, componentName, moduleName ): Observable<any> {
    let path = apiConstant.COOKIE_BANNER_LANG_PUBLISH_JSON.replace(':orgId', orgId);
    path = path.replace(':propId', propId);
    return this.http.post(environment.apiUrl + path, payloads, {params: {lang}}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieBanner, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  saveCustomLangInDB(payloads, orgId, propId, componentName, moduleName ): Observable<any> {
    let path = apiConstant.COOKIE_BANNER_LANG_SAVE_IN_DB.replace(':orgId', orgId);
    path = path.replace(':propId', propId);
    return this.http.post(environment.apiUrl + path, payloads).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieBanner, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }


}
