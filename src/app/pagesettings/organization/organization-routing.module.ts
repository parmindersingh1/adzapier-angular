import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrgpageComponent } from './orgpage.component';
import { AuthGuard } from 'src/app/_helpers';


const routes: Routes = [{path: '', component: OrgpageComponent, canActivate: [AuthGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }
