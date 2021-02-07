import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, throwError} from "rxjs";
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

  public openModal = new BehaviorSubject<any>({openModal: false, data: {}});
  public openModalWithData = this.openModal.asObservable();

  public openUnAuthModal = new BehaviorSubject<any>({isTrue: false, error: ''});
  public unAuthPopUp = this.openUnAuthModal.asObservable();


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
  getCurrentOrgPlanDetails(): any{
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

  getOrgPlanInfo(componentName, moduleName, orgID) {
    const path = apiConstant.PROPERTY_PLAN.replace(':orgId', orgID);
    return this.http.get(environment.apiUrl  + path, {params: {oID: orgID}}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  getOrgPlanDetails(componentName, moduleName, orgID) {
    const path = apiConstant.ORG_PLAN.replace(':orgId', orgID);
    return this.http.get(environment.apiUrl  + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  getCompanyPlanDetails(componentName, moduleName) {
    const path = apiConstant.COMPANY_PLAN;
    return this.http.get(environment.apiUrl  + path).pipe(map(res => res),
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

  getWebFormLicenseLimit(componentName, moduleName,orgID): Observable<any>{
    const path = '/available/form/' + orgID;
    return this.http.get(environment.apiUrl  + path).pipe(map(response => response),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.webForm, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  getDSARRequestLicenseLimit(componentName, moduleName,orgID): Observable<any>{
    const path = '/available/request/' + orgID;
    return this.http.get(environment.apiUrl  + path).pipe(map(response => response),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.webForm, componentName, moduleName, path);
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

  checkUserForOrgAndCompany(res , currentUser){
    const planData = this.getCurrentOrgPlanDetails();
    let msg = '';
    let flag = true;
    if(!res) {
      flag = false;
    }
    if(flag) {
      msg = `You can not add more than ${res.user_limit} Users`;
      if (currentUser >= res.user_limit) {
            flag = false;
      }
    }
    if (flag === false) {
      this.openModal.next({openModal : true, data: planData.response.plan_details, type: 'org', msg: msg})
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
      flag = false;
      for(const features of res.features) {
        if(features.feature == featuresName) {
            flag = true;
        }
      }
    }
    return flag;
  }


  isPropertyHasPlan(res, featuresName){
    let flag = true;
    if(!res) {
      flag = false;
    }
    if(!res.features){
      flag = false;
    }
    if (flag === false) {
      let msg = 'Sorry, You Are Not Allowed to Access This  Feature'
      this.openModal.next({openModal : true, data: res.plan_details, type: 'noPlan', msg: msg})    }
    return flag;
  }
  openUpgradeModalForCookieConsent(res){
    let msg = 'Sorry, You Are Not Allowed to Access This  Feature'
    this.openModal.next({openModal : true, data: res.response.plan_details, type: 'cookieConsent', msg: msg})
  }
  // getLicensesDetails() {

  // }
  isAllowCookieTracking(res, plan1, plan2) {
    let flag = true;
    if(!res) {
      flag = false;
    }
    if(!res.features){
      flag = false;
    }
    if(flag) {
      flag = false;
      for(const features of res.features) {
        if(features.feature == plan1 || features.feature ==plan2) {
            flag = true;
        }
      }
    }
    return flag;
  }

  isLicenseLimitAvailableForOrganization(reqestType,responseData): boolean {
    const changeResponseProperty = reqestType === 'form' ? 'form_available' : 'request_available';
      if(Object.keys(responseData).length === 0){
        this.openModal.next({openModal : true, data: responseData, type: 'org', msg: ''});
        return false;
      } else if(responseData[changeResponseProperty] > 0 || responseData[changeResponseProperty] === -1){
        return true;
      } else if(responseData[changeResponseProperty] === 0){
        const formMsg = 'You have exceeded form creation limit. For more details Manage subscription or upgrade plan';
        const requestMsg = 'You have exceeded request creation limit. For more details Manage subscription or upgrade plan'
        const respMsg = changeResponseProperty == 'form_available' ? formMsg : requestMsg;
        this.openModal.next({openModal : true, data: responseData, type: 'org', msg: respMsg });
        return false;
      } else {
        this.openModal.next({openModal : true, data: responseData, type: 'org', msg: ''});
        return false;
      }
  }

  setAvailableLicenseForFormAndRequestPerOrg(planDetails) {
    const planData = btoa(JSON.stringify(planDetails))
    localStorage.setItem('OrgLicenseFormAndRequest', planData);
  }
  getAvailableLicenseForFormAndRequestPerOrg() {
    let planData = localStorage.getItem('OrgLicenseFormAndRequest')
    if(planData) {
      planData = JSON.parse(atob(planData))
    } else {
      planData = '';
    }
    return planData;
    
  }
 


}
