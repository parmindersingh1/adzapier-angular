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
    console.log('compone', componentName)
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

    const headers = new HttpHeaders()
      .set('Cache-Control', 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0')
      .set('Pragma', 'no-cache')
      .set('Expires', '0');
    const url = environment.globleLangURL.replace(':lang', lang);
    return this.http.get(url, { headers });
  }

  GetCustomLangData(lang, oid, pid) {
    const headers = new HttpHeaders()
      .set('Cache-Control', 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0')
      .set('Pragma', 'no-cache')
      .set('Expires', '0');
    let url = environment.customLangURL.replace(':lang', lang);
    url = url.replace(':oid', oid)
    url = url.replace(':pid', pid)
    return this.http.get(url, {headers});
  }

  saveCustomLang(payloads, lang, orgId, propId, componentName, moduleName): Observable<any> {
    let path = apiConstant.COOKIE_BANNER.replace(':orgId', orgId);
    path = path.replace(':propId', propId);
    return this.http.post(environment.apiUrl + path, payloads, {params: {lang}}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieBanner, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }


}
