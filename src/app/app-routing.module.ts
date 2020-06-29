import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AnalyticsComponent } from './pages/dashboards/analytics/analytics.component';
import { AuthGuard } from './_helpers';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { OrgpageComponent } from './orgpage/orgpage.component';
import { UseractivityComponent } from './useractivity/useractivity.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { PagenotfoundComponent } from './errorpages/pagenotfound.component';
import { InternalerrorComponent } from './errorpages/internalerror.component';
import { PagenotfoundComponent1 } from './errorpages/404page.component';
import { DsarformComponent } from './dsarform/dsarform.component';
import { WebformsComponent } from './webforms/webforms.component';
import { EditwebformComponent } from './editwebform/editwebform.component';
import { PropertydashboardComponent } from './propertydashboard/propertydashboard.component';
import { PagesettingsComponent } from './pagesettings/pagesettings.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { PartnersComponent } from './partners/partners.component';
import { TermofuseComponent } from './termofuse/termofuse.component';
import { ContactusComponent } from './contactus/contactus.component';
import { CCPAComponent } from './ccpa/ccpa.component';
import { GDPRComponent } from './gdpr/gdpr.component';
import { PricingComponent } from './pricing/pricing.component';
import { GethelpComponent } from './gethelp/gethelp.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { CompanyComponent } from './company/company.component';
import { BillingComponent } from './billing/billing.component';
import { VerifyemailComponent } from './verifyemail/verifyemail.component';
import { OrganizationdetailsComponent } from './organizationdetails/organizationdetails.component';
import { OrganizationteamComponent } from './organizationteam/organizationteam.component';
import {DsarRequestsComponent} from "./dsar-requests/dsar-requests.component";
import {CheckoutComponent} from "./checkout/checkout.component";
import {CheckoutConfirmationComponent} from "./checkout-confirmation/checkout-confirmation.component";
import {UpdateBillingComponent} from "./update-billing/update-billing.component";
import {CcpaDsarComponent} from "./dashboard/ccpa-dsar/ccpa-dsar.component";
import {WelcomeComponent} from "./welcome/welcome.component";


const routes: Routes = [

  // { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotpasswordComponent },
  { path: 'privacypolicy', component: PrivacypolicyComponent },
  { path: 'partners', component: PartnersComponent },
  { path: 'termofuse', component: TermofuseComponent },
  { path: 'contactus', component: ContactusComponent },
  { path: 'ccpa', component: CCPAComponent },
  { path: 'gdpr', component: GDPRComponent },
  { path: 'gethelp', component: GethelpComponent },
  { path: 'changelog', component: ChangelogComponent },
  { path: 'home/dashboard/analytics', component: AnalyticsComponent, canActivate: [AuthGuard] },
  { path: 'user/password/change-password', component: ChangepasswordComponent, canActivate: [AuthGuard] },
  { path: 'user/profile/edit', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'organizations', component: OrgpageComponent, canActivate: [AuthGuard] },
  { path: 'pricing', component: PricingComponent },
  { path: 'organizationdetails/:id', component: OrganizationdetailsComponent, canActivate: [AuthGuard] },
  { path: 'organizationteam/:id', component: OrganizationteamComponent, canActivate: [AuthGuard] },
  { path: 'user/activity', component: UseractivityComponent, canActivate: [AuthGuard] },
  { path: 'resetpswd/:id', component: ResetpasswordComponent },
  { path: 'pagenotfound', component: PagenotfoundComponent },
  { path: '404page', component: PagenotfoundComponent1 },
  { path: 'internalerror', component: InternalerrorComponent },
  { path: 'dsarform', component: DsarformComponent, canActivate: [AuthGuard] },
  { path: 'dsar-requests', component: DsarRequestsComponent, canActivate: [AuthGuard]},
  { path: 'webforms', component: WebformsComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: PagesettingsComponent, canActivate: [AuthGuard] },
  { path: 'editwebforms/:crid', component: EditwebformComponent, canActivate: [AuthGuard] },
  { path: 'propertydashboard/:propid', component: PropertydashboardComponent, canActivate: [AuthGuard] },
  { path: 'company', component: CompanyComponent, canActivate: [AuthGuard] },
  { path: 'billing', component: BillingComponent, canActivate: [AuthGuard] },
  { path: 'billing/update', component: UpdateBillingComponent, canActivate: [AuthGuard] },
  { path: 'verify-email/:id', component: VerifyemailComponent },
  { path: 'checkout', component: CheckoutComponent,  canActivate: [AuthGuard] },
  { path: 'home/dashboard/ccpa-dsar', component: CcpaDsarComponent,  canActivate: [AuthGuard] },
  { path: 'success', component: CheckoutConfirmationComponent,  canActivate: [AuthGuard]  },
  { path: '', redirectTo: 'home/dashboard/analytics', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard]},

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
