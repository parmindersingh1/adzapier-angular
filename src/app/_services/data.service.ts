import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private billingPPlanDetails = new BehaviorSubject(null);
  public getBillingPlanDetails = this.billingPPlanDetails.asObservable();
  constructor() { }
  setBillingPlan(plan) {
    this.billingPPlanDetails.next(plan);
  }
}
