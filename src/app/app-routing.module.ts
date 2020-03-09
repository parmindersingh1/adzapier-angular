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


const routes: Routes = [

  // { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotpasswordComponent },
  { path: 'home/dashboard/analytics', component: AnalyticsComponent, canActivate: [AuthGuard] },
  { path: 'user/password/change-password', component: ChangepasswordComponent, canActivate: [AuthGuard] },
  { path: 'user/profile/edit', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'portalorg', component: OrgpageComponent, canActivate: [AuthGuard] },
  { path: 'user/activity', component: UseractivityComponent, canActivate: [AuthGuard] },
  { path: 'reset-password/:id', component: ResetpasswordComponent },
  { path: 'pagenotfound', component: PagenotfoundComponent },
  { path: '404page', component: PagenotfoundComponent1 },
  { path: 'internalerror', component: InternalerrorComponent },
  { path: '', redirectTo: 'home/dashboard/analytics', pathMatch: 'full', canActivate: [AuthGuard] },
  // { path: '', redirectTo: 'home/dashboard/analytics', pathMatch:'full' },




  // otherwise redirect to home
  { path: '**', redirectTo: '404page' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
