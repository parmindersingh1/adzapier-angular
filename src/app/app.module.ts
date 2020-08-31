import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { JwtInterceptor, fakeBackendProvider, ErrorInterceptor } from './_helpers';
import { environment } from '../environments/environment';
import { Ng2ChartJsModules } from 'chartjs-ng2-module';
import { HeaderComponent } from './_components/layout/header/header.component';
import { FooterComponent } from './_components/layout/footer/footer.component';
import { NavbarComponent } from './_components/layout/navbar/navbar.component';

import { AlertComponent } from './_components';

import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';

import { UseractivityComponent } from './useractivity/useractivity.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { PagenotfoundComponent } from './errorpages/pagenotfound.component';
import { InternalerrorComponent } from './errorpages/internalerror.component';
import { PagenotfoundComponent1 } from './errorpages/404page.component';
import { AuthenticationService } from './_services';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { PropertydashboardComponent } from './propertydashboard/propertydashboard.component';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { PricingComponent } from './pricing/pricing.component';
import { PartnersComponent } from './partners/partners.component';
import { TermofuseComponent } from './termofuse/termofuse.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { CCPAComponent } from './ccpa/ccpa.component';
import { VerifyemailComponent } from './verifyemail/verifyemail.component';

import { NgxUiLoaderModule, NgxUiLoaderConfig } from 'ngx-ui-loader';
import { ngxUiLoaderConfig } from './_constant/loading.contant';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutConfirmationComponent } from './checkout-confirmation/checkout-confirmation.component';
import { MatButtonModule } from '@angular/material/button';

import { SimpleNotificationsModule } from 'angular2-notifications';
import { WelcomeComponent } from './welcome/welcome.component';

import { SharedbootstrapModule } from './sharedbootstrap/sharedbootstrap.module';
import { CcpaDsarComponent } from './dashboard/ccpa-dsar/ccpa-dsar.component';
import { ChartsModule } from 'ng2-charts';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';

export const isMock = environment.mock;

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
    AlertComponent,
    ForgotpasswordComponent,
    UseractivityComponent,
    ResetpasswordComponent,
    PagenotfoundComponent,
    InternalerrorComponent,
    PagenotfoundComponent1,
    PropertydashboardComponent,
    PricingComponent,
    PartnersComponent,
    TermofuseComponent,
    PrivacypolicyComponent,
    CCPAComponent,
    VerifyemailComponent,
    CheckoutComponent,
    CheckoutConfirmationComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule,
    Ng2ChartJsModules,
    DragDropModule,

    BrowserAnimationsModule,
    SharedbootstrapModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    FeatherModule.pick(allIcons),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    MatButtonModule,
    ChartsModule,
    TableModule,
    MultiSelectModule
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
  exports: [
    // AnalyticsModule,
    BsDropdownModule, CollapseModule, SimpleNotificationsModule]
})
export class AppModule { }
