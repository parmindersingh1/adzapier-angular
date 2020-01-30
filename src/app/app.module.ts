import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { IconsModule } from './icons/icons.module';
import { JwtInterceptor, fakeBackendProvider,ErrorInterceptor } from './_helpers';

import { environment } from '../environments/environment';
import { AnalyticsComponent } from './pages/dashboards/analytics/analytics.component';
import { Ng2ChartJsModules } from 'chartjs-ng2-module';
import { HeaderComponent } from './_components/layout/header/header.component';
import { FooterComponent } from './_components/layout/footer/footer.component';
import { NavbarComponent } from './_components/layout/navbar/navbar.component';

import { AlertComponent } from './_components';

import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { UseractivityComponent } from './useractivity/useractivity.component';
import { OrgpageComponent } from './orgpage/orgpage.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';



export const isMock = environment.mock;
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AnalyticsComponent,
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
    AlertComponent,
    ForgotpasswordComponent,
    ChangepasswordComponent,
    EditProfileComponent,
    UseractivityComponent,
    OrgpageComponent,
    ResetpasswordComponent,
    
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgbModule,
    IconsModule,
    Ng2ChartJsModules,
     
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, 
      useClass: JwtInterceptor, 
      multi: true },
    { provide: HTTP_INTERCEPTORS, 
      useClass: ErrorInterceptor, 
      multi: true },

    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent],
  exports: [AnalyticsComponent]
})
export class AppModule { }
