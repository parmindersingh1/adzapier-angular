import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_helpers';
import { CompanyteamComponent } from './companyteam.component';


const routes: Routes = [{path: '', component: CompanyteamComponent, canActivate: [AuthGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyTeamRoutingModule { }
