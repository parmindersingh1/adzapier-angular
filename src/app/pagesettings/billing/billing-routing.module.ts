import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingComponent } from './billing.component';
import { AuthGuard } from 'src/app/_helpers';
import { UpdateBillingComponent } from '../update-billing/update-billing.component';
// import {UpdateBillingComponent} from "../../update-billing/update-billing.component";

const routes: Routes = [
  {path: '', component: BillingComponent,  canActivate: [AuthGuard]},
  {path: 'update', component: UpdateBillingComponent,  canActivate: [AuthGuard]}

  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule { }
