import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PricingComponent } from './pricing.component';
import { AuthGuard } from '../../../_helpers';
import {RouteguardService} from '../../../_services/routeguard.service'

const routes: Routes = [
  {path: '', component: PricingComponent, canActivate: [AuthGuard,RouteguardService]},
  {path: 'checkout', loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule), canActivate: [AuthGuard,RouteguardService]}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingRoutingModule { }
