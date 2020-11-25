import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CookieConsentComponent} from './cookie-consent.component';
import {Router, RouterModule, Routes} from '@angular/router';
import {SharedbootstrapModule} from '../../sharedbootstrap/sharedbootstrap.module';

const path: Routes = [
  {path: '', component: CookieConsentComponent}
];

@NgModule({
  declarations: [CookieConsentComponent],
  imports: [
    CommonModule,
    SharedbootstrapModule,
    RouterModule.forChild(path)
  ]
})
export class CookieConsentModule { }
