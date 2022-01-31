import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CookieConsentComponent} from './cookie-consent.component';
import {Router, RouterModule, Routes} from '@angular/router';
import {SharedbootstrapModule} from '../../sharedbootstrap/sharedbootstrap.module';
import {AuthGuard} from '../../_helpers';
import {RouteguardService} from '../../_services/routeguard.service';
import { LicenseguardPropertyService } from '../../_services/licenseguardproperty.service';
import {FormsModule} from '@angular/forms';
import {ChartsModule} from 'ng2-charts';
const path: Routes = [
  {path: '', component: CookieConsentComponent,canActivate: [AuthGuard, RouteguardService, LicenseguardPropertyService]}
];

@NgModule({
  declarations: [CookieConsentComponent],
    imports: [
        CommonModule,
        SharedbootstrapModule,
        RouterModule.forChild(path),
        FormsModule,
        ChartsModule
    ]
})
export class CookieConsentModule { }
