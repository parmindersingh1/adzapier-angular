import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../_helpers';

const route: Routes = [
  {
    path: 'cookie-tracking', loadChildren: () => import('./cookie-tracking/cookie-tracking.module').then(m => m.CookieTrackingModule), canActivate: [AuthGuard]
  },  {
    path: 'cookie-banner', loadChildren: () => import('./cookie-banner/cookie-banner.module').then(m => m.CookieBannerModule), canActivate: [AuthGuard]
  },  {
    path: 'cookie-category', loadChildren: () => import('./cookie-category/cookie-category.module').then(m => m.CookieCategoryModule), canActivate: [AuthGuard]
  },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(route)
  ]
})
export class CookieConsentModule { }
