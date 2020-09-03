import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../_helpers';
import {CcpaDsarComponent} from './ccpa-dsar.component';
import {ChartsModule} from 'ng2-charts';



const routes: Routes = [
  {path: '', component: CcpaDsarComponent,  canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [CcpaDsarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ChartsModule,
  ]
})
export class CcpaDsarModule { }
