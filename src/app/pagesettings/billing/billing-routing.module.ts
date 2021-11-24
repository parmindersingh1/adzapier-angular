import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingComponent } from './billing.component';
import { AuthGuard } from 'src/app/_helpers';
import {RouteguardService} from '../../_services/routeguard.service'
// import { UpdateBillingComponent } from '../update-billing/update-billing.component';
// import {UpdateBillingComponent} from "../../update-billing/update-billing.component";

const routes: Routes = [
  { path: '', redirectTo: 'manage', pathMatch: 'full' },
 {path: 'pricing', loadChildren: () => import('./pricing/pricing.module').then(m => m.PricingModule), canActivate: [AuthGuard,RouteguardService]},
 {path: 'manage', loadChildren: () => import('./manage-licence/manage-licence.module').then(m => m.ManageLicenceModule), canActivate: [AuthGuard,RouteguardService]},
 {path: 'cart', loadChildren: () => import('./Cartsystem/Cartsystem.module').then(m => m.CartsystemModule),canActivate: [AuthGuard,RouteguardService]},
 {path: 'cartreview', loadChildren: () => import('./cartreview/cartreview.module').then(m => m.CartreviewModule),canActivate: [AuthGuard,RouteguardService]},


//  {path: 'manage-product', loadChildren: () => import('./manage-product/manage-product.module').then(m => m.ManageProductModule), canActivate: [AuthGuard]}
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule { }
