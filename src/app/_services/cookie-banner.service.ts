import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CookieBannerService {

  constructor(private http: HttpClient) { }

  onSubmitCookieBannerData(payload) {
    return this.http.post(environment.apiUrl + 'abc', payload);
  }
}
