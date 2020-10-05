import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {LokiFunctionality, LokiStatusType} from '../_constant/loki.constant';
import {throwError} from 'rxjs';
import {LokiService} from './loki.service';
import {apiConstant} from '../_constant/api.constant';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {

  constructor(private  http: HttpClient,
              private loki: LokiService
              ) { }

  getConsent(propsId, pagelimit) {
    const path = apiConstant.COOKIE_CONSENT.replace(':propId', propsId);
    return this.http.get(environment.apiUrl + path + pagelimit).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.cookieConsent, path);
        return throwError(error);
      }),
    );
  }

  onSendLogs(errorType, msg, functionality, path) {
    this.loki.onSendErrorLogs(errorType, msg, functionality, path).subscribe();
  }
}
