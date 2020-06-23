import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesettingsComponent } from './pagesettings.component';
import { AuthGuard } from '../_helpers';
import { OrgpageComponent } from './organization/orgpage.component';
import { CompanyComponent } from './company/company.component';
import { BillingComponent } from './billing/billing.component';
import { OrganizationdetailsComponent } from './organizationdetails/organizationdetails.component';
import { OrganizationteamComponent } from './organizationteam/organizationteam.component';




const routes: Routes = [
  { path: '', component: PagesettingsComponent, canActivate: [AuthGuard]},
  {
    path: 'settings/billing',
    loadChildren: () => import(`./billing/billing.module`).then(m => m.BillingModule)
  },
  {
    path: 'settings/company',
    loadChildren: () => import(`./company/company.module`).then(m => m.CompanyModule)
  },
  {
    path: 'settings/organizations',
    children: [
      { path: '', loadChildren: () => import(`./organization/organization.module`).then(m => m.OrganizationModule) },
      {
        path: 'organizationdetails/:id',
        loadChildren: () => import(`./organizationdetails/organizationdetails.module`).then(m => m.OrganizationdetailsModule)
      },
      {
        path: 'organizationteam/:id',
        loadChildren: () => import(`./organizationteam/organizationteam.module`).then(m => m.OrganizationteamModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesettingsRoutingModule { }
