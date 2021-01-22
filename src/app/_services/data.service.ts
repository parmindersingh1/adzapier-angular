import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, throwError} from "rxjs";
import {catchError, map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { apiConstant } from '../_constant/api.constant';
import { LokiFunctionality, LokiStatusType } from '../_constant/loki.constant';
import { LokiService } from './loki.service';
import {featuresName} from '../_constant/features-name.constant';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private billingPPlanDetails = new BehaviorSubject(null);
  public getBillingPlanDetails = this.billingPPlanDetails.asObservable();

  private currentPropertyPlan = new BehaviorSubject<any>(this.getCurrentPropertyPlanDetails());
  public currentPropertyPlanDetails = this.currentPropertyPlan.asObservable();

  private openModal = new BehaviorSubject<any>({openModal: false, data: {}});
  public openModalWithData = this.openModal.asObservable();


  constructor(private http: HttpClient, private lokiService: LokiService) { }
  setBillingPlan(plan) {
    this.billingPPlanDetails.next(plan);
  }

  getCurrentPropertyPlanDetails(){
    let planData = localStorage.getItem('propertyPlan')
    if(planData) {
     planData = JSON.parse(atob(planData))
    } else {
      planData = '';
    }
    return planData;
  }

  changeCurrentPropertyPlan(currentItem) {
    this.currentPropertyPlan.next(currentItem);
  }
  setPropertyPlanToLocalStorage(planDetails) {
    const planData = btoa(JSON.stringify(planDetails))
    // debugger;
    localStorage.setItem('propertyPlan', planData);
}
  setOrgPlanToLocalStorage(planDetails) {
    const planData = btoa(JSON.stringify(planDetails))
    // debugger;
    localStorage.setItem('orgPlan', planData);
  }
  getCurrentOrgPlanDetails(){
    let planData = localStorage.getItem('orgPlan')
    if(planData) {
      planData = JSON.parse(atob(planData))
    } else {
      planData = '';
    }
    return planData;
  }
  getPropertyPlanDetails(componentName, moduleName, propID) {
    const path = apiConstant.PROPERTY_PLAN;
    return this.http.get(environment.apiUrl  + path, {params: {pID: propID}}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  getOrgPlanDetails(componentName, moduleName, orgID) {
    const path = apiConstant.ORG_PLAN;
    return this.http.get(environment.apiUrl  + path, {params: {oID: orgID}}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }


  getFeaturesList(componentName, moduleName) {
    const path = apiConstant.PROPERTY_PLAN;
    return this.http.get(environment.apiUrl  + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  isAllowFeature(res, featuresName){
    let flag = true;
    if(!res) {
      flag = false;
    }
    if(!res.features){
      flag = false;
    }
    if(flag) {
      for(const features of res.features) {
        if(features.feature === featuresName) {
          if (!features.quantity) {
            flag = false;
          }
        }
      }
    }
    if (flag === false) {
      this.openModal.next({openModal : true, data: res.plan_details})
    }
    return flag;
  }

  checkUserForOrg(res, featuresName, currentUser){
    let flag = true;
    if(!res) {
      flag = false;
    }
    if(!res.features){
      flag = false;
    }
    if(flag) {
      for(const features of res.features) {
        if(features.feature === featuresName) {
          if (features.quantity <= currentUser) {
            flag = false;
          }
        }
      }
    }
    if (flag === false) {
      this.openModal.next({openModal : true, data: res.plan_details})
    }
    return flag;
  }

  onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
    this.lokiService.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
  }


  isAllowFeatureByYes(res, featuresName){
    let flag = true;
    if(!res) {
      flag = false;
    }
    if(!res.features){
      flag = false;
    }
    if(flag) {
      for(const features of res.features) {
        if(features.feature === featuresName) {
          if (features.quantity != 'YES') {
            flag = false;
          }
        }
      }
    }
    return flag;
  }

  openUpgradeModal(res){
    this.openModal.next({openModal : true, data: res.response.plan_details})
  }
  // getLicensesDetails() {

  // }
}
