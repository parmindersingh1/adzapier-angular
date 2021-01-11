import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingComponent } from './billing.component';
import { AuthGuard } from 'src/app/_helpers';
// import { UpdateBillingComponent } from '../update-billing/update-billing.component';
// import {UpdateBillingComponent} from "../../update-billing/update-billing.component";

const routes: Routes = [
  {path: '', component: BillingComponent,  canActivate: [AuthGuard]},
 {path: 'pricing', loadChildren: () => import('./pricing/pricing.module').then(m => m.PricingModule), canActivate: [AuthGuard]},
 {path: 'manage', loadChildren: () => import('./manage-licence/manage-licence.module').then(m => m.ManageLicenceModule), canActivate: [AuthGuard]},
//  {path: 'manage-product', loadChildren: () => import('./manage-product/manage-product.module').then(m => m.ManageProductModule), canActivate: [AuthGuard]}
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule { }
