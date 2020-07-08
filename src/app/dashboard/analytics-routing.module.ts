import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalyticsComponent } from './analytics.component';
import { AuthGuard } from 'src/app/_helpers';


const routes: Routes = [
  {path: 'analytics', component: AnalyticsComponent,  canActivate: [AuthGuard]},
  {path: 'ccpa-dsar', loadChildren: () => import('./ccpa-dsar/ccpa-dsar.module').then(m => m.CcpaDsarModule) }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
