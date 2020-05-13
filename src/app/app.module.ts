import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { JwtInterceptor, fakeBackendProvider, ErrorInterceptor } from './_helpers';

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
import { PagenotfoundComponent } from './errorpages/pagenotfound.component';
import { InternalerrorComponent } from './errorpages/internalerror.component';
import { PagenotfoundComponent1 } from './errorpages/404page.component';
import { AuthenticationService } from './_services';
import { DsarformComponent } from './dsarform/dsarform.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { WebformsComponent } from './webforms/webforms.component';
import { EditwebformComponent } from './editwebform/editwebform.component';
import { PropertydashboardComponent } from './propertydashboard/propertydashboard.component';
import { QuillModule } from 'ngx-quill';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

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
    PagenotfoundComponent,
    InternalerrorComponent,
    PagenotfoundComponent1,
    DsarformComponent,
    WebformsComponent,
    EditwebformComponent,
    PropertydashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgbModule,
    Ng2ChartJsModules,
    DragDropModule,
    BsDropdownModule.forRoot(),
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    QuillModule.forRoot(),
    FeatherModule.pick(allIcons)
  ],
  providers: [
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },

    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent],
  exports: [AnalyticsComponent, BsDropdownModule, CollapseModule]
})
export class AppModule { }
