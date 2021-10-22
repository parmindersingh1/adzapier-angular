import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtInterceptor, fakeBackendProvider, ErrorInterceptor } from './_helpers';
import { HeaderModule } from './_components/layout/header/header.module';
import { FooterComponent } from './_components/layout/footer/footer.component';
import { PagenotfoundComponent } from './errorpages/pagenotfound.component';
import { InternalerrorComponent } from './errorpages/internalerror.component';
import { PagenotfoundComponent1 } from './errorpages/404page.component';
import { AuthenticationService } from './_services';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';
// import { FeatherModule } from 'angular-feather';
// import { allIcons } from 'angular-feather/icons';
import {NgxUiLoaderModule, NgxUiLoaderService} from 'ngx-ui-loader';
import { ngxUiLoaderConfig } from './_constant/loading.contant';
import { WelcomeComponent } from './welcome/welcome.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import {NgbCollapseModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import {TimeagoModule} from 'ngx-timeago';
import { SubscriptionPopupComponent } from './_components/subscription-popup/subscription-popup.component';
import { QuickstartmenuComponent } from './_components/quickstartmenu/quickstartmenu.component';

@NgModule({
  declarations: [
    AppComponent,
    // HomeComponent,
    // HeaderComponent,
    FooterComponent,
    // AlertComponent,
    // ForgotpasswordComponent,
    PagenotfoundComponent,
    InternalerrorComponent,
    PagenotfoundComponent1,
    // PropertydashboardComponent,
   // PricingComponent,
   //  PartnersComponent,
   //  TermofuseComponent,
   //  PrivacypolicyComponent,
   //  CCPAComponent,
   // VerifyemailComponent,
   //  CheckoutConfirmationComponent,
    WelcomeComponent,
    SubscriptionPopupComponent,
    QuickstartmenuComponent
  ],
  imports: [
    BrowserModule,
    // FormsModule,
    // ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    // FontAwesomeModule,
    // DragDropModule,
    BrowserAnimationsModule,
    // SharedbootstrapModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
  //  FeatherModule.pick(allIcons),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    TooltipModule.forRoot(),
    HeaderModule,
    // MatButtonModule,
    // TableModule,
    // MultiSelectModule,
    // ChartsModule,
    // Ng2ChartJsModules,
    ModalModule.forRoot(),
    TimeagoModule.forRoot(),
    // TabsModule.forRoot(),
    // AccordionModule.forRoot(),
    NgbCollapseModule,
    NgbModule,

  ],
  providers: [
    NgxUiLoaderService,
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
    fakeBackendProvider,

  ],
  bootstrap: [AppComponent],
  exports: [
    // AnalyticsModule,
    TimeagoModule,
    HeaderModule,
    TooltipModule,
    BsDropdownModule, CollapseModule]
})
export class AppModule { }
