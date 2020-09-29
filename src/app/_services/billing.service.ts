import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor(private http: HttpClient) { }
  getSessionId(data) {
    const path = '/billing/checkout/session';
    return this.http.post(environment.apiUrl + path, data);
  }

  getCurrentPlan() {
    const path = '/billing/current/subscription';
    return this.http.get(environment.apiUrl + path);
  }
  createSessionId() {
    const path = '/billing/update/card/session';
    return this.http.get(environment.apiUrl + path);
  }
  getCurrentPlanInfo() {
    const path = '/billing/current/plan';
    return this.http.get(environment.apiUrl + path);
  }
  upGradePlan(data) {
  const path = '/billing/upgrade/plan';
  return this.http.post(environment.apiUrl + path, data);
}

  cancelPlan() {
    const path = '/billing/cancel/subscription';
    return this.http.get(environment.apiUrl + path);
  }
}
