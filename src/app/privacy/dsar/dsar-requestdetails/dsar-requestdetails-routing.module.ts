import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DsarRequestdetailsComponent } from './dsar-requestdetails.component';
import { AuthGuard } from 'src/app/_helpers';
import { RouteguardService } from 'src/app/_services/routeguard.service';
import {LicenseguardService} from 'src/app/_services/licenseguard.service';

const routes: Routes = [{path: '', component: DsarRequestdetailsComponent, canActivate: [AuthGuard,RouteguardService,LicenseguardService]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DsarRequestdetailsRoutingModule { }
