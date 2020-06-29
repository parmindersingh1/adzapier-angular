import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingComponent } from './billing.component';
import { AuthGuard } from 'src/app/_helpers';

const routes: Routes = [{path: '', component: BillingComponent,  canActivate: [AuthGuard]}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule { }
