import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationdetailsComponent } from './organizationdetails.component';
import { AuthGuard } from 'src/app/_helpers';


const routes: Routes = [{path: '', component: OrganizationdetailsComponent, canActivate: [AuthGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationdetailsRoutingModule { }
