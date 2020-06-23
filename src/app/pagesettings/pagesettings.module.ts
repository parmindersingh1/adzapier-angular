import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { PagesettingsComponent } from './pagesettings.component';
import { OrgpageComponent } from './organization/orgpage.component';
// import { CompanyComponent } from './company/company.component';
// import { BillingComponent } from './billing/billing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { OrganizationteamComponent } from './organizationteam/organizationteam.component';
// import { OrganizationdetailsComponent } from './organizationdetails/organizationdetails.component';
// import { OrgpageComponent } from '../orgpage/orgpage.component';
// import { CompanyComponent } from '../company/company.component';
// import { BillingComponent } from '../billing/billing.component';
import { PagesettingsRoutingModule } from './pagesettings-routing.module';
import { SharedbootstrapModule } from '../sharedbootstrap/sharedbootstrap.module';
@NgModule({
  declarations: [PagesettingsComponent,
    // OrgpageComponent,
  //  CompanyComponent, BillingComponent,
   // OrganizationteamComponent,
  //  OrganizationdetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagesettingsRoutingModule,
    SharedbootstrapModule
  ]
})
export class PagesettingsModule { }
