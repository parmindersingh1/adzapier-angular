import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {

  constructor(private  http: HttpClient) { }

  getConsent(propsId, pagelimit) {
    return this.http.get(environment.apiUrl + '/consents/tracking/' + propsId + pagelimit);
  }
}
