import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {apiConstant} from '../_constant/api.constant';
import {moduleName} from 'src/app/_constant/module-name.constant';
import {LokiFunctionality, LokiStatusType} from '../_constant/loki.constant';
import {LokiService} from './loki.service';

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

  public isLicenseApplied = new BehaviorSubject<accesstype>({requesttype:'organization',hasaccess:false});
  get isLicenseAvailable(){
    return this.isLicenseApplied.asObservable();
  }

  public isLicenseAppliedForProperty = new BehaviorSubject<accesstype>({requesttype:'property',hasaccess:false});
  get isLicenseAvailableForProperty(){
    return this.isLicenseAppliedForProperty.asObservable();
  }

  public isConsentPreferenceApplied = new BehaviorSubject<accesstype>({requesttype:'consentpreference',hasaccess:false});
  get isConsentPreferenceAppliedForProperty(){
    return this.isConsentPreferenceApplied.asObservable();
  }
  
  public OrganizationCreatedStatus = new BehaviorSubject<boolean>(false);
  get isOrganizationCreated(){
    return this.OrganizationCreatedStatus.asObservable();
  }

  public checkClickedURL = new BehaviorSubject<any>("/home/welcome");
  get checkNavigationURL(){
    return this.checkClickedURL.asObservable();
  }
 
  licenseAvailabilityObj = {};
  planUsageByOrgid = [];
  urlClickedByUser;
  constructor(private http: HttpClient, private lokiService: LokiService) {
  }

  setBillingPlan(plan) {
    this.billingPPlanDetails.next(plan);
  }

  getCurrentPropertyPlanDetails(): any {
    let planData = localStorage.getItem('propertyPlan')
    if (planData) {
      planData = JSON.parse(atob(planData))
    } else {
      planData = '';
    }
    return planData;
  }

  getCurrentOrganizationPlanDetails() {
    let planData = localStorage.getItem('orgPlan')
    if (planData) {
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

  getCurrentOrgPlanDetails(): any {
    let planData = localStorage.getItem('orgPlan')
    if (planData) {
      planData = JSON.parse(atob(planData))
    } else {
      planData = '';
    }
    return planData;
  }

  getPropertyPlanDetails(componentName, moduleName, propID) {
    const path = apiConstant.PROPERTY_PLAN;
    return this.http.get(environment.apiUrl + path, {params: {pID: propID}}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  getOrgPlanInfo(componentName, moduleName, orgID) {
    const path = apiConstant.PROPERTY_PLAN.replace(':orgId', orgID);
    return this.http.get(environment.apiUrl + path, {params: {oID: orgID}}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  getOrgAndPropPlanInfo(componentName, moduleName, orgID) {
    const path = apiConstant.PROP_AND_ORG_PLAN.replace(':orgId', orgID);
    return this.http.get(environment.apiUrl + path, {params: {oID: orgID}}).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  getOrgPlanDetails(componentName, moduleName, orgID) {
    const path = apiConstant.ORG_PLAN.replace(':orgId', orgID);
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  getCompanyPlanDetails(componentName, moduleName) {
    const path = apiConstant.COMPANY_PLAN;
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }


  getFeaturesList(componentName, moduleName) {
    const path = apiConstant.PROPERTY_PLAN;
    return this.http.get(environment.apiUrl + path).pipe(map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.consentDashboard, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  getWebFormLicenseLimit(componentName, moduleName, orgID): Observable<any> {
    const path = '/available/form/' + orgID;
    return this.http.get(environment.apiUrl + path).pipe(map(response => response),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.webForm, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  getDSARRequestLicenseLimit(componentName, moduleName, orgID): Observable<any> {
    const path = '/available/request/' + orgID;
    return this.http.get(environment.apiUrl + path).pipe(map(response => response),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.webForm, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  isAllowFeature(res, featuresName) {
    let flag = true;
    if (!res) {
      flag = false;
    }
    if (!res.features) {
      flag = false;
    }
    if (flag) {
      for (const features of res.features) {
        if (features.feature === featuresName) {
          if (!features.quantity) {
            flag = false;
          }
        }
      }
    }
    if (flag === false) {
      this.openModal.next({openModal: this.isSubscriptionExistForProperty(), data: res.plan_details})
    }
    return flag;
  }

  checkUserForCompany(res, currentUser) {
    const planData = this.getCurrentOrgPlanDetails();
    let msg = '';
    let flag = true;
    if (!res) {
      flag = false;
    }
    if (flag) {
      msg = `You can not add more than ${res.user_limit} Users`;
      if (!res.user_available) {
        flag = false;
      }
    }
    if (flag === false) {
      this.openModal.next({
        openModal: true,
        data: planData.response.plan_details,
        type: 'company',
        msg: msg,
        currentplan: this.getCurrentOrgPlanDetails().response.plan_details
      })
    }
    return flag;
  }

  checkUserForOrg(res, currentUser, plan_details) {
    let msg = '';
    let flag = true;
    if (!res) {
      flag = false;
    }
    if (flag) {
      msg = `You can not add more than ${res.user_limit} Users`;
      if (!res.user_available) {
        flag = false;
      }
    }
    let planType = 'org';
    if (plan_details) {
      if (plan_details.hasOwnProperty('product_name')) {
        planType = plan_details.product_name.includes('Cookie Consent') ? 'cookieConsent' : 'org';
      }
    }

    if (flag === false) {
      this.openModal.next({
        openModal: this.isSubscriptionExistForProperty(),
        data: plan_details,
        type: planType,
        msg: msg,
        currentplan: plan_details
      })
    }
    return flag;
  }

  onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
    this.lokiService.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
  }


  isAllowFeatureByYes(res, featuresName) {
    let flag = true;
    if (!res) {
      flag = false;
    }
    if (!res.features) {
      flag = false;
    }
    if (flag) {
      flag = false;
      for (const features of res.features) {
        if (features.feature == featuresName) {
          flag = true;
        }
      }
    }
    return flag;
  }


  isPropertyHasPlan(res, featuresName) {
    let flag = true;
    if (!res) {
      flag = false;
    }
    if (Object.keys(res.plan_details.cookieConsent).length === 0) {
      flag = false;
    }
    if (flag === false) {
      this.openModal.next({
        openModal: this.isSubscriptionExistForProperty(),
        data: res.plan_details.cookieConsent,
        type: 'cookieConsent',
        // currentplan: this.getCurrentOrgPlanDetails().response.plan_details
      });
    }
    return flag;
  }

  checkNullPlanForProp(res) {
    let planDetails = null;
    if (res.hasOwnProperty('response')) {
      if (res.response.hasOwnProperty('plan_details')) {
        planDetails = res.response.plan_details;
      }
    }
    this.openModal.next({
      openModal: this.isSubscriptionExistForProperty(),
      data: planDetails.cookieConsent,
      type: 'cookieConsent',
    });
  }


  openUpgradeModalForCookieConsent(res):any {
    let planDetails = null;
    if (res.hasOwnProperty('response')) {
      if (res.response.hasOwnProperty('plan_details')) {
        planDetails = res.response.plan_details;
      }
    }

    this.openModal.next({
      openModal: this.isSubscriptionExistForProperty(),
      data: planDetails.cookieConsent,
      type: 'cookieConsent',
    });
    return Object.keys(planDetails.cookieConsent).length !== 0 ? true : false;
  }


  openUpgradeModalForConsentPreference(res):any {
    let planDetails = null;
    if (res.hasOwnProperty('response')) {
      if (res.response.hasOwnProperty('plan_details')) {
        planDetails = res.response.plan_details;
      }
    }

    this.openModal.next({
      openModal: this.isSubscriptionExistForProperty(),
      data: planDetails.consentPreference,
      type: 'consentPreference',
    });
    return Object.keys(planDetails.consentPreference).length !== 0 ? true : false;
  }


  openUpgradeModalForDsar(res):any {
    const msg = 'Sorry, You Are Not Allowed to Access This  Feature';
    let planDetails = null;
    if (res.hasOwnProperty('response')) {
      if (res.response.hasOwnProperty('plan_details')) {
        planDetails = res.response.plan_details;
      }
    }
    let currentplan = null;
    if (this.getCurrentOrgPlanDetails().hasOwnProperty('response')) {
      if (this.getCurrentOrgPlanDetails().response.hasOwnProperty('plan_details')) {
        currentplan = res.response.plan_details;
      }
    }


    this.openModal.next({
      openModal: this.isSubscriptionExistForOrg(),
      data: planDetails,
      type: 'org',
      msg: msg,
      currentplan: currentplan
    })
    return currentplan !== null ? true : false;
  }
  // getLicensesDetails() {

  // }
  isAllowCookieTracking(res, plan1, plan2) {
    let flag = true;
    if (!res) {
      flag = false;
    }
    if (!res.features) {
      flag = false;
    }
    if (flag) {
      flag = false;
      for (const features of res.features) {
        if (features.feature == plan2) {
          flag = true;
        }
      }
    }
    return flag;
  }

  isLicenseLimitAvailableForOrganization(requestType, responseData): boolean {
    let changeResponseProperty;
    if (requestType === 'form') {
      changeResponseProperty = 'form_available';
    } else if (requestType === 'request') {
      changeResponseProperty = 'request_available';
    } else if (requestType === 'workflow') {
      changeResponseProperty = 'workflow_available';
    }
    if (Object.keys(responseData).length === 0) {
      this.openModal.next({openModal: this.isSubscriptionExistForOrg(), data: responseData, type: 'org', msg: ''});
      return false;
    } else if (responseData[changeResponseProperty] === -1 || responseData[changeResponseProperty] > 0) {
      return true;
    } else if (responseData[changeResponseProperty] === 0) {
      const formMsg = 'You have exceeded form creation limit. For more details Manage subscription or upgrade plan';
      const requestMsg = 'You have exceeded request creation limit. For more details Manage subscription or upgrade plan'
      const respMsg = changeResponseProperty == 'form_available' ? formMsg : requestMsg;
      this.openModal.next({
        openModal: this.isSubscriptionExistForOrg(),
        data: responseData,
        type: 'org',
        msg: respMsg,
        currentplan: this.getCurrentOrgPlanDetails() !== '' ? this.getCurrentOrgPlanDetails().response.plan_details : null
      });
      return false;
    } else {
      this.openModal.next({
        openModal: this.isSubscriptionExistForOrg(),
        data: responseData,
        type: 'org',
        msg: '',
        currentplan: this.getCurrentOrgPlanDetails() !== '' ? this.getCurrentOrgPlanDetails().response.plan_details : null
      });
      return false;
    }
  }

  setAvailableLicenseForFormAndRequestPerOrg(planDetails) {
    const planData = btoa(JSON.stringify(planDetails))
    localStorage.setItem('OrgLicenseFormAndRequest', planData);
  }

  removeAvailableLicenseForFormAndRequestPerOrg() {
    localStorage.removeItem('OrgLicenseFormAndRequest');
  }

  getAvailableLicenseForFormAndRequestPerOrg() {
    let planData = localStorage.getItem('OrgLicenseFormAndRequest')
    if (planData) {
      planData = JSON.parse(atob(planData))
    } else {
      planData = '';
    }
    return planData;

  }

  getWorkflowLicenseLimit(componentName, moduleName,orgid?): Observable<any> {
    let path
    if(orgid){
       path = '/available/workflow/' + orgid;
    }else{
      path = '/available/workflow/'
    }
    return this.http.get(environment.apiUrl + path).pipe(map(response => response),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.workFlow, componentName, moduleName, path);
        return throwError(error);
      }),
    );
  }

  setWorkflowLicenseToLocalStorage(planDetails) {
    const planData = btoa(JSON.stringify(planDetails))
    localStorage.setItem('workflowPlan', planData);
  }

  getWorkflowLicenseToLocalStorage() {
    let planData = localStorage.getItem('workflowPlan')
    if (planData) {
      return planData = JSON.parse(atob(planData))
    }
  }

  checkLicenseAvailabilityPerOrganization(org): Observable<any>{
    let webFormLicense = this.getWebFormLicenseLimit(this.constructor.name, moduleName.headerModule, org.id || org.organization_id || org);
    let requestLicense = this.getDSARRequestLicenseLimit(this.constructor.name, moduleName.headerModule, org.id || org.organization_id || org);
    let workflowLicense = this.getWorkflowLicenseLimit(this.constructor.name, moduleName.headerModule, org.id || org.organization_id || org);
    return forkJoin([webFormLicense, requestLicense, workflowLicense])
  }

  setOrganizationPropertyCreationStatus(status){
    localStorage.setItem('propertySelected', JSON.stringify(status));
  }

  getOrganizationPropertyCreationStatus(){
    let isPropertystatus = localStorage.getItem('propertySelected');
    return isPropertystatus = JSON.parse(isPropertystatus)
  }

  checkLicenseAvailabilityForProperty(prop):Observable<any>{
    let propLicense = this.getPropertyPlanDetails(this.constructor.name,moduleName.headerModule,prop.property_id);
    return forkJoin([propLicense]);
  }

  isSubscriptionExistForProperty():boolean{
        let licenseStatusForProperty;
        this.isLicenseAppliedForProperty.subscribe((status) => {
            licenseStatusForProperty = status;
        });
        if (!licenseStatusForProperty.hasaccess) {
            return true;
        } else {
            return false;
        }
  }

  isSubscriptionExistForOrg():boolean{
    let licenseStatus;
    this.isLicenseApplied.subscribe((status) => {
      licenseStatus = status;
    });
    if (!licenseStatus.hasaccess) {
      return true;
    } else {
      return false;
    }
   }
}

export class accesstype {
  public requesttype: string;
  public hasaccess:boolean;
}
