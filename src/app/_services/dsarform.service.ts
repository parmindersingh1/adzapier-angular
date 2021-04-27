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
    if (localStorage.getItem('formControlList') !== null) {
      return JSON.parse(localStorage.getItem('formControlList'));
    } else {
      this.loadWebControls();
    }
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
    const actualIndex = controlList.findIndex((t) => t.controlId === newItem.controlId);
    if (actualIndex === oldItemIndex) {
      controlList[oldItemIndex] = newItem;
    } else {
      controlList[actualIndex] = newItem;
      this.swapElements(controlList, actualIndex, oldItemIndex);
    }

    localStorage.setItem('formControlList', JSON.stringify(controlList));
  }

  swapElements(elementArray, oldIndex, newIndex) {
    const temp = elementArray[oldIndex];
    elementArray[oldIndex] = elementArray[newIndex];
    elementArray[newIndex] = temp;
  }

  removeControls() {
    return localStorage.removeItem('formControlList');
  }

  storeDataBeforeEdit(data) {
    sessionStorage.setItem('storeCurrentFieldData', JSON.stringify(data));
  }

  getStoreDataBeforeEdit() {
    return JSON.parse(sessionStorage.getItem('storeCurrentFieldData'));
  }

}
