import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtInterceptor, fakeBackendProvider, ErrorInterceptor } from './_helpers';
import { HeaderComponent } from './_components/layout/header/header.component';
import { FooterComponent } from './_components/layout/footer/footer.component';
import { PagenotfoundComponent } from './errorpages/pagenotfound.component';
import { InternalerrorComponent } from './errorpages/internalerror.component';
import { PagenotfoundComponent1 } from './errorpages/404page.component';
import { AuthenticationService } from './_services';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import {NgxUiLoaderModule, NgxUiLoaderService} from 'ngx-ui-loader';
import { ngxUiLoaderConfig } from './_constant/loading.contant';
import { WelcomeComponent } from './welcome/welcome.component';
import { ModalModule } from 'ngx-bootstrap';
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    // HomeComponent,
    HeaderComponent,
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
    WelcomeComponent
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
    FeatherModule.pick(allIcons),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    // MatButtonModule,
    // TableModule,
    // MultiSelectModule,
    // ChartsModule,
    // Ng2ChartJsModules,
    ModalModule.forRoot(),
    // TabsModule.forRoot(),
    // AccordionModule.forRoot(),
    NgbCollapseModule
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
    BsDropdownModule, CollapseModule]
})
export class AppModule { }
