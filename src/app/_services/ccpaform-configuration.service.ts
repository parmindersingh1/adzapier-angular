import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.develop';
import { Observable, BehaviorSubject } from 'rxjs';
import { WebControls } from '../_models/webcontrols';
import { CCPAFormFields } from '../_models/ccpaformfields';

@Injectable({
  providedIn: 'root'
})
export class CCPAFormConfigurationService extends WebControls {
  webFormControlList: CCPAFormFields;
  captureFormDataWhileNavigate = new BehaviorSubject<any>('');
  currentFormData = this.captureFormDataWhileNavigate.asObservable();
  constructor(private httpClient: HttpClient) { 
    super();
    this.loadCreatedWebControls();
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
    controlList[oldItemIndex].controllabel = newItem.controllabel;
    controlList[oldItemIndex].indexCount = newItem.indexCount + 'Index';
    controlList[oldItemIndex].control = newItem.control;
    controlList[oldItemIndex].selectOptions = newItem.selectOptions || '';
    localStorage.setItem('CCPAformControlList', JSON.stringify(controlList));
  }



  createCCPAForm(orgId, propId, formObject) {
    return this.httpClient.post<any>(environment.apiUrl + '/ccpa/form/' + orgId + '/' + propId, formObject);
  }

  getCCPAFormList(orgId, propId): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + '/ccpa/form/' + orgId + '/' + propId);
  }

  getCCPAFormConfigByID(orgId, propId, ccparequestid): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + '/ccpa/form/' + orgId + '/' + propId + '/' + ccparequestid);
  }

  captureCurrentSelectedFormData(currentItem) {
    this.captureFormDataWhileNavigate.next(currentItem);
  }
}
