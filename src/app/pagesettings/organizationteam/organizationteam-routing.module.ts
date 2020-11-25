import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationteamComponent } from './organizationteam.component';
import { AuthGuard } from 'src/app/_helpers';


const routes: Routes = [{path: '', component: OrganizationteamComponent, canActivate: [AuthGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationteamRoutingModule { }
