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
import { PagesettingsComponent } from './pagesettings/pagesettings.component';
import { PricingComponent } from './pricing/pricing.component';
import { PartnersComponent } from './partners/partners.component';
import { ContactusComponent } from './contactus/contactus.component';
import { TermofuseComponent } from './termofuse/termofuse.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { CCPAComponent } from './ccpa/ccpa.component';
import { GDPRComponent } from './gdpr/gdpr.component';
import { GethelpComponent } from './gethelp/gethelp.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { CompanyComponent } from './company/company.component';
import { BillingComponent } from './billing/billing.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { VerifyemailComponent } from './verifyemail/verifyemail.component';
import { OrganizationdetailsComponent } from './organizationdetails/organizationdetails.component';
import { OrganizationteamComponent } from './organizationteam/organizationteam.component';
import { FilterPipe } from './filter.pipe';
import {NgxUiLoaderModule, NgxUiLoaderConfig} from 'ngx-ui-loader';
import { DsarRequestsComponent } from './dsar-requests/dsar-requests.component';
import {ngxUiLoaderConfig} from './_constant/loading.contant';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutConfirmationComponent } from './checkout-confirmation/checkout-confirmation.component';
import {TimeAgoPipe} from 'time-ago-pipe';
import { UpdateBillingComponent } from './update-billing/update-billing.component';
import {MatButtonModule} from "@angular/material/button";
import {CcpaDsarComponent} from "./dashboard/ccpa-dsar/ccpa-dsar.component";
import { ChartsModule } from 'ng2-charts';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { WelcomeComponent } from './welcome/welcome.component';



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
    PropertydashboardComponent,
    PagesettingsComponent,
    PricingComponent,
    PartnersComponent,
    ContactusComponent,
    TermofuseComponent,
    PrivacypolicyComponent,
    CCPAComponent,
    GDPRComponent,
    GethelpComponent,
    ChangelogComponent,
    CompanyComponent,
    BillingComponent,
    VerifyemailComponent,
    OrganizationdetailsComponent,
    OrganizationteamComponent,
    FilterPipe,
    DsarRequestsComponent,
    CheckoutComponent,
    CheckoutConfirmationComponent,
    TimeAgoPipe,
    UpdateBillingComponent,
    CcpaDsarComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgbModule,
    Ng2ChartJsModules,
    DragDropModule,
    NgxPaginationModule,
    PaginationModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    QuillModule.forRoot(),
    FeatherModule.pick(allIcons),
    PaginationModule.forRoot(),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    MatButtonModule,
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
