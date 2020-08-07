import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CookieConsentComponent} from './cookie-consent.component';
import {Router, RouterModule, Routes} from '@angular/router';

const path: Routes = [
  {path: '', component: CookieConsentComponent}
];

@NgModule({
  declarations: [CookieConsentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(path)
  ]
})
export class CookieConsentModule { }
