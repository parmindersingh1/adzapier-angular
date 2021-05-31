import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AnalyticsComponent} from './analytics.component';
import {AuthGuard} from 'src/app/_helpers';
import { LicenseguardPropertyService } from '../_services/licenseguardproperty.service';
import { RouteguardService } from '../_services/routeguard.service';


const routes: Routes = [
  {path: 'welcome', component: AnalyticsComponent, canActivate: [AuthGuard]},
  {path: 'dashboard/ccpa-dsar', loadChildren: () => import('./ccpa-dsar/ccpa-dsar.module').then(m => m.CcpaDsarModule),
   canActivate: [AuthGuard, RouteguardService] },
  {
    path: 'dashboard/cookie-consent',
    loadChildren: () => import('./cookie-consent/cookie-consent.module').then(m => m.CookieConsentModule),
    canActivate: [AuthGuard, RouteguardService, LicenseguardPropertyService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule {
}
