import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { WebControls } from '../_models/webcontrols';
import { CCPAFormFields } from '../_models/ccpaformfields';
import { shareReplay } from 'rxjs/operators';
import { map } from 'jquery';

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
  constructor(private httpClient: HttpClient) {
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
    controlList[oldItemIndex] = newItem;
    localStorage.setItem('CCPAformControlList', JSON.stringify(controlList));
  }

  removeControls() {
    return localStorage.removeItem('CCPAformControlList');
  }

  createCCPAForm(orgId, propId, formObject) {
    return this.httpClient.post<any>(environment.apiUrl + '/ccpa/form/' + orgId + '/' + propId, formObject);
  }

  updateCCPAForm(orgId, propId, ccparequestid, updatedformObject) {
    return this.httpClient.put<any>(environment.apiUrl + '/ccpa/form/' + orgId + '/' + propId + '/' + ccparequestid, updatedformObject);
  }

  getCCPAFormList(orgId, propId): Observable<any> {
    if (!this.ccpaFormList$) {
       this.ccpaFormList$ = this.httpClient.get<any>(environment.apiUrl + '/ccpa/form/' + orgId + '/' + propId)
       .pipe(shareReplay(1));
    }
    return this.ccpaFormList$;
  }

  getCCPAFormConfigByID(orgId, propId, ccparequestid): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + '/ccpa/form/' + orgId + '/' + propId + '/' + ccparequestid);
  }

  captureCurrentSelectedFormData(currentItem) {
    sessionStorage.setItem('currentwebform',JSON.stringify(currentItem));
    this.captureFormDataWhileNavigate.next(currentItem);
  }

  getStateList(): Observable<any> {
    return this.httpClient.get<any>('assets/json/states.json');
  }

  getCountryList(): Observable<any> {
    return this.httpClient.get<any>('assets/json/countries.json');
  }

  getCurrentSelectedFormData() {
    return JSON.parse(sessionStorage.getItem('currentwebform'));
  }
}
