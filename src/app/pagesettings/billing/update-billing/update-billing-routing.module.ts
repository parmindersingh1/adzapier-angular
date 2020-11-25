import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdateBillingComponent } from './update-billing.component';
import { AuthGuard } from 'src/app/_helpers';


const routes: Routes = [{path: '', component: UpdateBillingComponent, canActivate: [AuthGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateBillingRoutingModule { }
