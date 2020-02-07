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


const routes: Routes = [

   { path: '', component: HomeComponent, canActivate: [AuthGuard] },
   { path: 'login', component: LoginComponent },
   { path: 'register', component: RegisterComponent },
   {path:'forgotpassword',component:ForgotpasswordComponent},
   { path: 'dashboard/analytics', component: AnalyticsComponent },
   {path:'changepassword',component:ChangepasswordComponent},
   {path:'editprofile',component:EditProfileComponent},
   {path:'portalorg',component:OrgpageComponent},
   {path:'useractivity',component:UseractivityComponent},
   {path:'resetpswd/:id',component:ResetpasswordComponent},
   {path:'pagenotfound',component:PagenotfoundComponent},
   {path:'internalerror',component:InternalerrorComponent},
   
   
  // otherwise redirect to home
   { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
