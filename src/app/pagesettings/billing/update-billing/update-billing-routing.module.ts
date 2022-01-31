import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdateBillingComponent } from './update-billing.component';
import { AuthGuard } from 'src/app/_helpers';
import {RouteguardService} from '../../../_services/routeguard.service'

const routes: Routes = [{path: '', component: UpdateBillingComponent, canActivate: [AuthGuard,RouteguardService]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateBillingRoutingModule { }
