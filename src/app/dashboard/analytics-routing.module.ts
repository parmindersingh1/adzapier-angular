import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalyticsComponent } from './analytics.component';
import { AuthGuard } from 'src/app/_helpers';
import {CcpaDsarComponent} from "./ccpa-dsar/ccpa-dsar.component";

const routes: Routes = [
  {path: '', component: AnalyticsComponent,  canActivate: [AuthGuard]},
  {path: 'ccpa-dsar', component: CcpaDsarComponent,  canActivate: [AuthGuard]}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
