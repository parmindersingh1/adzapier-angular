import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { WebControls } from '../_models/webcontrols';
import { CCPAFormFields } from '../_models/ccpaformfields';
import { shareReplay, map, switchMap, catchError } from 'rxjs/operators';
import {LokiService} from './loki.service';
import {LokiFunctionality, LokiStatusType} from '../_constant/loki.constant';
import {throwError} from 'rxjs';
import {apiConstant} from '../_constant/api.constant';
@Injectable({
  providedIn: 'root'
})
export class CCPAFormConfigurationService extends WebControls {
  webFormControlList: CCPAFormFields;
  ccpaFormList$: Observable<any>;
  captureFormDataWhileNavigate = new BehaviorSubject<any>('');
  currentFormData = this.captureFormDataWhileNavigate.asObservable();
  subjectType: any;
  requestType: any;
  constructor(private httpClient: HttpClient, private lokiService: LokiService) {
    super();
    // this.loadCreatedWebControls();
  }

  setFormControlList(data: CCPAFormFields[]) {
    localStorage.setItem('CCPAformControlList', JSON.stringify(data));
  }

  getFormControlList() {
    return JSON.parse(localStorage.getItem('CCPAformControlList'));
  }

  addControl(newItem) {
    const controls = JSON.parse(localStorage.getItem('CCPAformControlList'));
    controls.push(newItem);
    localStorage.setItem('CCPAformControlList', JSON.stringify(controls));
  }

  deleteControl(item) {
    const controlList = JSON.parse(localStorage.getItem('CCPAformControlList'));
    for (let i = 0; i < controlList.length; i++) {
      if (controlList[i].indexCount === item.indexCount) {
        controlList.splice(i, 1);
      }
    }
    localStorage.setItem('CCPAformControlList', JSON.stringify(controlList));
  }

  updateControl(oldItem, oldItemIndex, newItem) {
    const controlList = JSON.parse(localStorage.getItem('CCPAformControlList'));
    const actualIndex = controlList.findIndex((t) => t.controlId === newItem.controlId);
    controlList[oldItemIndex] = newItem;
    if (actualIndex === oldItemIndex) {
      controlList[oldItemIndex] = newItem;
    } else {
      controlList[actualIndex] = newItem;
      this.swapElements(controlList, actualIndex, oldItemIndex);
    }
    localStorage.setItem('CCPAformControlList', JSON.stringify(controlList));
  }

  swapElements(elementArray, oldIndex, newIndex) {
    const temp = elementArray[oldIndex];
    elementArray[oldIndex] = elementArray[newIndex];
    elementArray[newIndex] = temp;
  }

  removeControls() {
    return localStorage.removeItem('CCPAformControlList');
  }

  createCCPAForm(orgId, propId, formObject, componentName, moduleName) {
    const path = '/ccpa/form/' + orgId + '/' + propId;
    return this.httpClient.post<any>(environment.apiUrl + path, formObject)
    .pipe(shareReplay(1), catchError(error => {
      this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.webForm, componentName, moduleName, path);
      return throwError(error);
    }));
  }

  updateCCPAForm(orgId, propId, ccparequestid, updatedformObject, componentName, moduleName) {
    const path = '/ccpa/form/' + orgId + '/' + propId + '/' + ccparequestid;
    return this.httpClient.put<any>(environment.apiUrl + path, updatedformObject)
    .pipe(shareReplay(1), catchError(error => {
      this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.updateCCPAForm, componentName, moduleName, path);
      return throwError(error);
    }));
  }

  getCCPAFormList(orgId, propId, componentName, moduleName): Observable<any> {
    // this.ccpaFormList$ =
    const key = 'response';
    const path = '/ccpa/form/' + orgId + '/' + propId;
    return this.httpClient.get<any>(environment.apiUrl + path).pipe(
      map(res => res[key]),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getCCPAFormList, componentName, moduleName, path);
        return throwError(error);
      })
      );
    // .pipe(shareReplay(1));
    // return this.ccpaFormList$;
  }

  getCCPAFormConfigByID(orgId, propId, ccparequestid, componentName, moduleName): Observable<any> {
    const path = '/ccpa/form/' + orgId + '/' + propId + '/' + ccparequestid;
    return this.httpClient.get<any>(environment.apiUrl + path ).pipe(
      shareReplay(1),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getCCPAFormConfigByID, componentName, moduleName, path);
        return throwError(error);
      })
    );
  }

  captureCurrentSelectedFormData(currentItem) {
    localStorage.setItem('currentwebform', JSON.stringify(currentItem));
    this.captureFormDataWhileNavigate.next(currentItem);
  }

  removeCurrentSelectedFormData(){
    localStorage.removeItem('currentwebform');
  }

  getStateList(): Observable<any> {
    return this.httpClient.get<any>('assets/json/states.json');
  }

  getCountryList(): Observable<any> {
    return this.httpClient.get<any>('assets/json/countries.json');
  }

  getCurrentSelectedFormData() {
    return JSON.parse(localStorage.getItem('currentwebform'));
  }

  getCaptcha(componentName, moduleName): Observable<any> {
    const path = '/captcha';
    return this.httpClient.get<any>(environment.apiUrl + path)
    .pipe(
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getWebFormCaptcha, componentName, moduleName, path);
        return throwError(error);
      })
    );
  }

  getImage(imageUrl: string, componentName, moduleName): Observable<Blob> {
    return this.httpClient.get(imageUrl, { responseType: 'blob' })
    .pipe(
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getImage, componentName, moduleName, imageUrl);
        return throwError(error);
      })
    );
  }
 
  verifyCaptcha(obj, componentName, moduleName) {
    const path = '/captcha/verify/' + obj.captcha_id + '/' + obj.captcha_solution;
    return this.httpClient.post<any>(environment.apiUrl + path, {})
    .pipe(
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.verifyCaptcha, componentName, moduleName, path);
        return throwError(error);
      })
    );
  }

  publishDSARForm(orgId, propId, ccparequestid, componentName, moduleName): Observable<any> {
    const path = '/ccpa/form/' + orgId + '/' + propId + '/' + ccparequestid;
    return this.httpClient.patch<any>(environment.apiUrl + path, {})
    .pipe(catchError(error => {
      this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.webForm, componentName, moduleName, path);
      return throwError(error);
    }));
  }

  onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
    this.lokiService.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
  }

}
