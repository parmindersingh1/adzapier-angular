import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AnalyticsComponent} from './analytics.component';
import {AuthGuard} from 'src/app/_helpers';
import { LicenseguardPropertyService } from '../_services/licenseguardproperty.service';


const routes: Routes = [
  {path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGuard]},
  {path: 'ccpa-dsar', loadChildren: () => import('./ccpa-dsar/ccpa-dsar.module').then(m => m.CcpaDsarModule) },
  {
    path: 'cookie-consent',
    loadChildren: () => import('./cookie-consent/cookie-consent.module').then(m => m.CookieConsentModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'consent-preference',
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
