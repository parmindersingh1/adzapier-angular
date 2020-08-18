import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CookieBannerService {

  constructor(private http: HttpClient) { }

  onSubmitCookieBannerData(payload, path) {
    return this.http.post(environment.apiUrl + path, payload);
  }
  onUpdateCookieBannerData(payload, path) {
    return this.http.put(environment.apiUrl + path, payload);
  }
  onGetPlanType() {
    return this.http.get(environment.apiUrl + '/company/service');
  }

  onGetCookieBannerData(path) {
    return this.http.get(environment.apiUrl + path);
  }
}
