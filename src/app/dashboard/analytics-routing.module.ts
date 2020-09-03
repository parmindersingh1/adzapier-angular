import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AnalyticsComponent} from './analytics.component';
import {AuthGuard} from 'src/app/_helpers';


const routes: Routes = [
  {path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGuard]},
  {
    path: 'cookie-consent',
    loadChildren: () => import('./cookie-consent/cookie-consent.module').then(m => m.CookieConsentModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule {
}
