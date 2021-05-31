import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../_helpers';
import {RouteguardService} from '../../_services/routeguard.service'
const route: Routes = [
  {
    path: 'cookie-tracking', loadChildren: () => import('./cookie-tracking/cookie-tracking.module').then(m => m.CookieTrackingModule), canActivate: [AuthGuard,RouteguardService]
  },  {
    path: 'cookie-banner', loadChildren: () => import('./cookie-banner/cookie-banner.module').then(m => m.CookieBannerModule), canActivate: [AuthGuard,RouteguardService]
  },  {
    path: 'cookie-category', loadChildren: () => import('./cookie-category/cookie-category.module').then(m => m.CookieCategoryModule), canActivate: [AuthGuard,RouteguardService]
  },
  {
    path: 'manage-vendors', loadChildren: () => import('./manage-vendors/manage-vendors.module').then(m => m.ManageVendorsModule), canActivate: [AuthGuard,RouteguardService]
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
