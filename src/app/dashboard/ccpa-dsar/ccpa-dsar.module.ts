import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../_helpers';
import {CcpaDsarComponent} from './ccpa-dsar.component';
import {ChartsModule} from 'ng2-charts';
import {Ng2ChartJsModules} from 'chartjs-ng2-module';
import {SharedbootstrapModule} from '../../sharedbootstrap/sharedbootstrap.module';


const routes: Routes = [
  {path: '', component: CcpaDsarComponent,  canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [CcpaDsarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    Ng2ChartJsModules,
    ChartsModule,
    // SharedbootstrapModule
  ]
})
export class CcpaDsarModule { }
