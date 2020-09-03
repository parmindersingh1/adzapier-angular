import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../_helpers';
import {CcpaDsarComponent} from './ccpa-dsar.component';
import {SharedbootstrapModule} from '../../sharedbootstrap/sharedbootstrap.module';
import {ChartsModule} from 'ng2-charts';
import {Ng2ChartJsModules} from 'chartjs-ng2-module';

const routes: Routes = [
  {path: '', component: CcpaDsarComponent,  canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [CcpaDsarComponent],
    imports: [
        CommonModule,
        SharedbootstrapModule,
        RouterModule.forChild(routes),
        Ng2ChartJsModules,
        ChartsModule
    ]
})
export class CcpaDsarModule { }
