import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.develop';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor(private http: HttpClient) { }
  getSessionId(data) {
    const path = '/billing/subscribe';
    return this.http.post(environment.apiUrl + path, data);
  }

  getCurrentPlan() {
    const path = '/billing/current_plan';
    return this.http.get(environment.apiUrl + path);
  }
}
