import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AnalyticsComponent} from './analytics.component';
import {AuthGuard} from 'src/app/_helpers';
import { LicenseguardPropertyService } from '../_services/licenseguardproperty.service';


const routes: Routes = [
  {path: 'welcome', component: AnalyticsComponent, canActivate: [AuthGuard]},
  {path: 'dashboard/ccpa-dsar', loadChildren: () => import('./ccpa-dsar/ccpa-dsar.module').then(m => m.CcpaDsarModule) },
  {
    path: 'dashboard/cookie-consent',
    loadChildren: () => import('./cookie-consent/cookie-consent.module').then(m => m.CookieConsentModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/consent-preference',
    loadChildren: () => import('./consent-solution/consent-solution.module').then(m => m.ConsentSolutionModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule {
}
