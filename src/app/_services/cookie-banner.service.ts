import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
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

  constructor(private http: HttpClient, private loki: LokiService) { }

  onSubmitCookieBannerData(payload, orgId, propId): Observable<any> {
    let path = apiConstant.CONSENT_BANNER.replace(':orgId', orgId);
    path = path.replace(':propId', propId);
    return this.http.post(environment.apiUrl + path, payload);
  }
  onUpdateCookieBannerData(payload, orgId, propId): Observable<any> {
    let path = apiConstant.CONSENT_BANNER.replace(':orgId', orgId);
    path = path.replace(':propId', propId);
    return this.http.put(environment.apiUrl + path, payload).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieBanner, path);
        return throwError(error);
      }),
    );
  }
  onGetPlanType(): Observable<any> {
    const path = apiConstant.COMPANY_SERVICE;
    return this.http.get(environment.apiUrl + path)
      .pipe(map(res => res),
        catchError(error => {
          this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieBanner, path);
          return throwError(error);
        }),
      );
  }

  onGetCookieBannerData( orgId, propId ): Observable<any> {
    let path = apiConstant.CONSENT_BANNER.replace(':orgId', orgId);
    path = path.replace(':propId', propId);
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieBanner, path);
        return throwError(error);
      }),
    );
  }

  onSendLogs(errorType, msg, functionality, path) {
    this.loki.onSendErrorLogs(errorType, msg, functionality, path).subscribe();
  }
}
