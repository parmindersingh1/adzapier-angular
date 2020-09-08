import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { WebControls } from '../_models/webcontrols';
import { CCPAFormFields } from '../_models/ccpaformfields';
import { shareReplay, map, switchMap } from 'rxjs/operators';

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

  createCCPAForm(orgId, propId, formObject) {
    return this.httpClient.post<any>(environment.apiUrl + '/ccpa/form/' + orgId + '/' + propId, formObject);
  }

  updateCCPAForm(orgId, propId, ccparequestid, updatedformObject) {
    return this.httpClient.put<any>(environment.apiUrl + '/ccpa/form/' + orgId + '/' + propId + '/' + ccparequestid, updatedformObject);
  }

  getCCPAFormList(orgId, propId): Observable<any> {
    // this.ccpaFormList$ = 
    const key = 'response';
    return this.httpClient.get<any>(environment.apiUrl + '/ccpa/form/' + orgId + '/' + propId).pipe(
      map(res => res[key])
      );
    // .pipe(shareReplay(1));
    // return this.ccpaFormList$;
  }

  getCCPAFormConfigByID(orgId, propId, ccparequestid): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + '/ccpa/form/' + orgId + '/' + propId + '/' + ccparequestid);
  }

  captureCurrentSelectedFormData(currentItem) {
    sessionStorage.setItem('currentwebform', JSON.stringify(currentItem));
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

  getCaptcha(): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + '/captcha');
  }

  getImage(imageUrl: string): Observable<Blob> {
    return this.httpClient.get(imageUrl, { responseType: 'blob' });
  }
 
  verifyCaptcha(obj) {
    return this.httpClient.post<any>(environment.apiUrl + '/captcha/verify/' + obj.captcha_id + '/' + obj.captcha_solution, {});
  }

}
