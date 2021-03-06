import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_helpers';
import { PagenotfoundComponent } from './errorpages/pagenotfound.component';
import { InternalerrorComponent } from './errorpages/internalerror.component';
import { PagenotfoundComponent1 } from './errorpages/404page.component';
import { RouteguardService } from './_services/routeguard.service';
import { LicenseguardPropertyService } from './_services/licenseguardproperty.service';
import { LicenseGuardConsentPreferenceService } from './_services/licenseguardconsentpreference.service';

const routes: Routes = [
  {path : 'share',loadChildren : () => import('./share/share.module').then(m => m.ShareModule)},
  {path : 'signout',loadChildren : () => import('./signout-page/signout-page.module').then(m => m.SignoutPageModule)},

  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule) },
  {path : 'signup' , loadChildren : () => import('./twostepregister/twostepregister.module').then(m => m.TwostepregisterModule)},
  { path: 'invited-user-verify-email/:id', loadChildren: () => import('./invited-user-verify/invited-user-verify.module').then(m => m.InvitedUserVerifyModule) },
  { path: 'forgot-password', loadChildren: () => import('./forgotpassword/forgotpassword.module').then(m => m.ForgotpasswordModule) },
  // { path: 'privacypolicy', component: PrivacypolicyComponent },
  // { path: 'partners', component: PartnersComponent },
  // { path: 'termofuse', component: TermofuseComponent },
  { path: 'contactus', loadChildren: () => import('./contactus/contactus.module').then(m => m.ContactusModule) },
  // { path: 'dsar', component: CCPAComponent },
  { path: 'gdpr', loadChildren: () => import('./gdpr/gdpr.module').then(m => m.GdprModule) },
  { path: 'changelog', loadChildren: () => import('./changelog/changelog.module').then(m => m.ChangelogModule) },
  { path: 'gethelp', loadChildren: () => import('./gethelp/gethelp.module').then(m => m.GethelpModule) },
  {
    path: 'home', loadChildren: () => import('./dashboard/analytics.module')
      .then(m => m.AnalyticsModule), canActivate: [AuthGuard]
  },
  { path: 'userprofile', loadChildren: () => import('./edit-profile/edit-profile.module').then(m => m.EditProfileModule) },
  // {path: 'pricing', loadChildren: () =>
  //     import('./pagesettings/billing/pricing/pricing.module').then(m => m.PricingModule)},
  { path: 'resetpswd/:id', loadChildren: () => import('./resetpassword/resetpassword.module').then(m => m.ResetpasswordModule) },
  {path: 'setpassword/:userid',loadChildren: () => import('./inviteuserpassword/inviteuserpassword.module').then(m => m.InviteuserpasswordModule)},
  { path: 'pagenotfound', component: PagenotfoundComponent },
  { path: '404page', component: PagenotfoundComponent1 },
  { path: 'internalerror', component: InternalerrorComponent },
  { path: 'privacy/dsar/dsarform', loadChildren: () => import('./privacy/dsar/dsarform/dsarform.module').then(m => m.DsarformModule) },

  { path: 'privacy/dsar/dsarform/:id', loadChildren: () => import('./privacy/dsar/dsarform/dsarform.module').then(m => m.DsarformModule) },
  {
    path: 'privacy/dsar/requests', loadChildren: () => import('./privacy/dsar/dsar-requests/dsar-requests.module')
      .then(m => m.DsarRequestsModule)
  },
  // {
  //   path: 'privacy/dsar/requests-details/:id',
  //   loadChildren: () => import('./privacy/dsar/dsar-requestdetails/dsar-requestdetails.module').then(m => m.DsarRequestdetailsModule)
  // },
  {
    path: 'privacy/dsar/requests-details/:reqid/:companyid/:orgid/:propid/:formID',
    loadChildren: () => import('./privacy/dsar/dsar-requestdetails/dsar-requestdetails.module').then(m => m.DsarRequestdetailsModule)
  },
  { path: 'privacy/dsar/webforms', loadChildren: () => import('./privacy/dsar/webforms/webforms.module').then(m => m.WebformsModule), canActivate: [AuthGuard] },
  {
    path: 'privacy/dsar/workflows', loadChildren: () => import('./privacy/dsar/workflows/workflows.module')
    .then(m => m.WorkflowsModule)
  },
  {
    path: 'cookie-consent', loadChildren: () => import('./privacy/cookie-consent/cookie-consent.module')
      .then(m => m.CookieConsentModule), canActivate: [AuthGuard,RouteguardService,LicenseguardPropertyService]
  },
  {
    path: 'consent-preference', loadChildren: () => import('./privacy/consent-solutions/consent-solutions.module')
      .then(m => m.ConsentSolutionsModule), canActivate: [AuthGuard,RouteguardService,LicenseGuardConsentPreferenceService]
  },
  { path: 'privacy/dsar/createworkflow', loadChildren: () => import('./privacy/dsar/createworkflow/createworkflow.module')
  .then(m => m.CreateworkflowModule) },
  { path: 'privacy/dsar/createworkflow/:id', loadChildren: () => import('./privacy/dsar/createworkflow/createworkflow.module')
  .then(m => m.CreateworkflowModule) },
  { path: 'settings', loadChildren: () => import('./pagesettings/pagesettings.module').then(m => m.PagesettingsModule) },
  { path: 'error', loadChildren: () => import('./errorpage/errorpage.module').then(m => m.ErrorpageModule) },
  // { path: 'propertydashboard/:propid', component: PropertydashboardComponent, canActivate: [AuthGuard] },
  { path: 'verify-email/:id', loadChildren: () => import('./verifyemail/verifyemail.module').then(m => m.VerifyemailModule) },
  // { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  // { path: 'success', component: CheckoutConfirmationComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'home/welcome', pathMatch: 'full' },
  { path: 'plans', loadChildren: () => import('./plans/plan.module').then(m => m.PlanModule) },
  // { path: '', redirectTo: 'home/dashboard/analytics', pathMatch:'full' },
  // otherwise redirect to home
  { path: '**', redirectTo: 'home/welcome', pathMatch: 'full' } //, runGuardsAndResolvers:'always'
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', enableTracing: false, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
