import {HostListener, Injectable} from '@angular/core';
import { CanDeactivate } from '@angular/router';
export  interface HasUnsavedData {
  hasUnsavedData(): boolean;
}
@Injectable()
export class HasUnsavedDataGuard implements CanDeactivate<any> {
  canDeactivate(component: HasUnsavedData): boolean {
    try {
      if (component.hasUnsavedData && component.hasUnsavedData()) {
        return confirm('You have some unsaved form data. Are you sure, you want to leave this page?');
      }
    } catch (e){
      return confirm('You have some unsaved form data. Are you sure, you want to leave this page?');
    }
    return true;
  }
}
