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
    path: 'company',
    children: [
      {path: '', loadChildren: () => import('./company/company.module').then(m => m.CompanyModule) },
      {path: 'companyteam', loadChildren: () => import('./companyteam/companyteam.module').then(m => m.CompanyTeamModule) }
    ]
  },
  {
    path: 'billing',
    children: [
      {path: '', loadChildren: () => import('./billing/billing.module').then(m => m.BillingModule) },
      {path: 'update',
      loadChildren: () => import('./billing/update-billing/update-billing.module').then(m => m.UpdateBillingModule)}
    ]
  },
  {
    path: 'organizations',
    children: [
      { path: '', loadChildren: () => import('./organization/organization.module').then(m => m.OrganizationModule) },
      {
        path: 'details/:id',
        loadChildren: () => import('./organizationdetails/organizationdetails.module').then(m => m.OrganizationdetailsModule)
      },
      {
        path: 'organizationteam/:id',
        loadChildren: () => import('./organizationteam/organizationteam.module').then(m => m.OrganizationteamModule)
      }
    ]
  },
  {
    path: 'system-integration'
  , loadChildren: () => import('./system_integration/system_integration.module').then(m => m.SystemIntegrationModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesettingsRoutingModule { }
