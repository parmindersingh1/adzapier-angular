import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { WebControls } from '../_models/webcontrols';
import { CCPAFormFields } from '../_models/ccpaformfields';
import { shareReplay, map,  catchError, tap, share, finalize } from 'rxjs/operators';
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
  dsarformbycrid: any;
  cachedDSARObservable: Observable<any>;
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

  getCCPAFormList(orgId, propId, componentName, moduleName, pagelimit?): Observable<any> {
    // this.ccpaFormList$ =
    const key = 'response';
    let path;
    if(pagelimit !== undefined){
      path = '/ccpa/form/' + orgId + '/' + propId + pagelimit;
    }else{
      path = '/ccpa/form/' + orgId + '/' + propId; 
    }
    return this.httpClient.get<any>(environment.apiUrl + path).pipe(
      map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getCCPAFormList, componentName, moduleName, path);
        return throwError(error);
      })
      );
    // .pipe(shareReplay(1));
    // return this.ccpaFormList$;
  }

  getCCPAFormConfigByID(orgId, propId, ccparequestid,actionperformed, componentName, moduleName): Observable<any> {
    let observable: Observable<any>;
      if (this.dsarformbycrid !== undefined && this.dsarformbycrid.response.crid === ccparequestid && actionperformed !== 'dataupdated') {
        observable = of(this.dsarformbycrid);
      }  else if (this.cachedDSARObservable) {
        observable = this.cachedDSARObservable;
      } else {
        const path = '/ccpa/form/' + orgId + '/' + propId + '/' + ccparequestid;
        this.cachedDSARObservable = this.httpClient.get<any>(environment.apiUrl + path )
          .pipe(
            tap(res => this.dsarformbycrid = res),
            share(),
            finalize(() => this.cachedDSARObservable = null),
            catchError(error => {
              this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getCCPAFormConfigByID, componentName, moduleName, path);
              return throwError(error);
            })
          );
        observable = this.cachedDSARObservable;
      }
    return observable;

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

  getDSARFormList(orgId, propId, componentName, moduleName): Observable<any> {
    const path = '/dsar/form/' + orgId + '/' + propId;
    return this.httpClient.get<any>(environment.apiUrl + path).pipe(
      map(res => res),
      catchError(error => {
        this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.getCCPAFormList, componentName, moduleName, path);
        return throwError(error);
      })
    );
  }

  deleteDSARForm(orgid, propid, form_config_id, reqObj, componentName, moduleName){
    const path = '/dsar/form/' + orgid +'/' + propid + '/' +  form_config_id;
    return this.httpClient.put<any>(environment.apiUrl + path, reqObj)
    .pipe(catchError(error => {
      this.onSendLogs(LokiStatusType.ERROR, error, LokiFunctionality.webForm, componentName, moduleName, path);
      return throwError(error);
    }));
  }

  storeDataBeforeEdit(data) {
    sessionStorage.setItem('storeCurrentFieldData', JSON.stringify(data));
  }

  getStoreDataBeforeEdit() {
    return JSON.parse(sessionStorage.getItem('storeCurrentFieldData'));
  }

  removeStoredDataBeforeEdit(){
    return sessionStorage.removeItem('storeCurrentFieldData')
  }

  onSendLogs(errorType, msg, functionality, componentName, moduleName, path) {
    this.lokiService.onSendErrorLogs(errorType, msg, functionality, componentName, moduleName, path).subscribe();
  }

}
