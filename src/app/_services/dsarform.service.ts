import { Injectable } from '@angular/core';
import { CCPAFormFields } from '../_models/ccpaformfields';
import { WebControls } from '../_models/webcontrols';

@Injectable({
  providedIn: 'root'
})
export class DsarformService extends WebControls {
  webFormControlList: CCPAFormFields;
  constructor() {
    super();
    this.loadWebControls();
  }

  setFormControlList(data: CCPAFormFields[]) {
    localStorage.setItem('formControlList', JSON.stringify(data));
  }

  getFormControlList() {
    return JSON.parse(localStorage.getItem('formControlList'));
  }

  addControl(newItem) {
    const controls = JSON.parse(localStorage.getItem('formControlList'));
    controls.push(newItem);
    localStorage.setItem('formControlList', JSON.stringify(controls));
 }

  deleteControl(item) {
    const controlList = JSON.parse(localStorage.getItem('formControlList'));
    for (let i = 0; i < controlList.length; i++) {
      if (controlList[i].indexCount === item.indexCount) {
        controlList.splice(i, 1);
      }
    }
    localStorage.setItem('formControlList', JSON.stringify(controlList));
  }

  updateControl(oldItem, oldItemIndex, newItem) {
    const controlList = JSON.parse(localStorage.getItem('formControlList'));
    controlList[oldItemIndex].controllabel = newItem.controllabel;
    controlList[oldItemIndex].indexCount = newItem.indexCount + 'Index';
    controlList[oldItemIndex].control = newItem.control;
    controlList[oldItemIndex].selectOptions = newItem.selectOptions || '';
    localStorage.setItem('formControlList', JSON.stringify(controlList));
  }


}
