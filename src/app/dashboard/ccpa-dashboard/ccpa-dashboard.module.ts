import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CcpaDashboardComponent} from './ccpa-dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../_helpers';

const routes: Routes = [
  {path: '', component: CcpaDashboardComponent,  canActivate: [AuthGuard]}
];



@NgModule({
  declarations: [CcpaDashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class CcpaDashboardModule { }
