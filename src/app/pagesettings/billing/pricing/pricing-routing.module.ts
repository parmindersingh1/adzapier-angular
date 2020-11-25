import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PricingComponent } from './pricing.component';
import { AuthGuard } from '../../../_helpers';


const routes: Routes = [
  {path: '', component: PricingComponent, canActivate: [AuthGuard]},
  {path: 'checkout', loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule), canActivate: [AuthGuard]}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingRoutingModule { }
