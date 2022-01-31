import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../_helpers';
import {RouteguardService} from '../../_services/routeguard.service'
import {LicenseguardPropertyService} from '../../_services/licenseguardproperty.service';
import {HasUnsavedDataGuard} from '../../_helpers/formUnsaved.guard';

const route: Routes = [
  {
    path: 'cookie-tracking', loadChildren: () => import('./cookie-tracking/cookie-tracking.module').then(m => m.CookieTrackingModule), canActivate: [AuthGuard,RouteguardService,LicenseguardPropertyService]
  },  {
    path: 'cookie-banner', loadChildren: () => import('./cookie-banner/cookie-banner.module').then(m => m.CookieBannerModule), canActivate: [AuthGuard,RouteguardService,LicenseguardPropertyService]
  },
  {
    path: 'banner-configuration', loadChildren: () => import('./banner-config/banner-config.module').then(m => m.BannerConfigModule), canActivate: [AuthGuard,RouteguardService,LicenseguardPropertyService], canDeactivate: [HasUnsavedDataGuard]
  },
  {
    path: 'cookie-category', loadChildren: () => import('./cookie-category/cookie-category.module').then(m => m.CookieCategoryModule), canActivate: [AuthGuard,RouteguardService,LicenseguardPropertyService]
  },
  {
    path: 'manage-vendors', loadChildren: () => import('./manage-vendors/manage-vendors.module').then(m => m.ManageVendorsModule), canActivate: [AuthGuard,RouteguardService,LicenseguardPropertyService]
  },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(route)
  ],
  providers: [HasUnsavedDataGuard]
})
export class CookieConsentModule { }
