import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './_helpers';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';

import { UseractivityComponent } from './useractivity/useractivity.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { PagenotfoundComponent } from './errorpages/pagenotfound.component';
import { InternalerrorComponent } from './errorpages/internalerror.component';
import { PagenotfoundComponent1 } from './errorpages/404page.component';

import { PropertydashboardComponent } from './propertydashboard/propertydashboard.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { PartnersComponent } from './partners/partners.component';
import { TermofuseComponent } from './termofuse/termofuse.component';
import { CCPAComponent } from './ccpa/ccpa.component';
import { PricingComponent } from './pricing/pricing.component';

import { VerifyemailComponent } from './verifyemail/verifyemail.component';

import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutConfirmationComponent } from './checkout-confirmation/checkout-confirmation.component';


const routes: Routes = [

  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'signup', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule) },
  { path: 'forgot-password', component: ForgotpasswordComponent },
  { path: 'privacypolicy', component: PrivacypolicyComponent },
  { path: 'partners', component: PartnersComponent },
  { path: 'termofuse', component: TermofuseComponent },
  { path: 'contactus', loadChildren: () => import('./contactus/contactus.module').then(m => m.ContactusModule) },
  { path: 'ccpa', component: CCPAComponent },
  { path: 'gdpr', loadChildren: () => import('./gdpr/gdpr.module').then(m => m.GdprModule) },
  { path: 'changelog', loadChildren: () => import('./changelog/changelog.module').then(m => m.ChangelogModule) },
  { path: 'gethelp', loadChildren: () => import('./gethelp/gethelp.module').then(m => m.GethelpModule) },
  {
    path: 'home/dashboard', loadChildren: () => import('./dashboard/analytics.module')
      .then(m => m.AnalyticsModule)
  },
  { path: 'userprofile', loadChildren: () => import('./edit-profile/edit-profile.module').then(m => m.EditProfileModule) },
  { path: 'pricing', component: PricingComponent, canActivate: [AuthGuard] },
  { path: 'user/activity', component: UseractivityComponent, canActivate: [AuthGuard] },
  { path: 'resetpswd/:id', component: ResetpasswordComponent },
  { path: 'pagenotfound', component: PagenotfoundComponent },
  { path: '404page', component: PagenotfoundComponent1 },
  { path: 'internalerror', component: InternalerrorComponent },
  { path: 'privacy/dsar/dsarform', loadChildren: () => import('./dsarform/dsarform.module').then(m => m.DsarformModule) },
  {
    path: 'privacy/dsar/dsar-requests', loadChildren: () => import('./privacy/dsar/dsar-requests/dsar-requests.module')
      .then(m => m.DsarRequestsModule)
  },
  {
    path: 'privacy/dsar/dsar-requests-details/:id',
    loadChildren: () => import('./privacy/dsar/dsar-requestdetails/dsar-requestdetails.module').then(m => m.DsarRequestdetailsModule)
  },
  { path: 'privacy/dsar/webforms', loadChildren: () => import('./privacy/dsar/webforms/webforms.module').then(m => m.WebformsModule) },
  { path: 'settings', loadChildren: () => import('./pagesettings/pagesettings.module').then(m => m.PagesettingsModule) },
  { path: 'editwebforms/:crid', loadChildren: () => import('./editwebform/editwebform.module').then(m => m.EditwebformModule) },
  { path: 'propertydashboard/:propid', component: PropertydashboardComponent, canActivate: [AuthGuard] },
  { path: 'verify-email/:id', component: VerifyemailComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'success', component: CheckoutConfirmationComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'home/dashboard/analytics', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'plans', loadChildren: () => import('./plans/plan.module').then(m => m.PlanModule) },
  // { path: '', redirectTo: 'home/dashboard/analytics', pathMatch:'full' },
  // otherwise redirect to home
  { path: '**', redirectTo: '404page' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
