import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DsarRequestsComponent } from './dsar-requests.component';
import { AuthGuard } from 'src/app/_helpers';

const routes: Routes = [
  { path: '', component: DsarRequestsComponent, canActivate: [AuthGuard],
  // children: [
  //   { path: 'dsar-requests-details/:id', loadChildren: () => import(`../dsar-requestdetails/dsar-requestdetails.module`)
  //   .then(m => m.DsarRequestdetailsModule) }
  // ]
  },
  { path: 'privacy/dsar/dsar-requests-details/:id', loadChildren: () => import(`../dsar-requestdetails/dsar-requestdetails.module`)
  .then(m => m.DsarRequestdetailsModule) }
  // privacy/dsar/dsar-requests
 // {
  //  path: 'dsar-requests-details/:id',
  //  children: [
  // { path: 'dsar-requests-details/:id', loadChildren: () => import(`../dsar-requestdetails/dsar-requestdetails.module`)
  // .then(m => m.DsarRequestdetailsModule) }
      // {
      //   path: 'organizationdetails/:id',
      //   loadChildren: () => import(`./organizationdetails/organizationdetails.module`).then(m => m.OrganizationdetailsModule)
      // },
      // {
      //   path: 'organizationteam/:id',
      //   loadChildren: () => import(`./organizationteam/organizationteam.module`).then(m => m.OrganizationteamModule)
      // }
   // ]
 // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DsarRequestsRoutingModule { }
