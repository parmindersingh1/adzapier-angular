import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../_helpers';
import {CcpaDsarComponent} from './ccpa-dsar.component';
import {SharedbootstrapModule} from '../../sharedbootstrap/sharedbootstrap.module';
import {ChartsModule} from 'ng2-charts';
import {BsDropdownModule} from 'ngx-bootstrap';

const routes: Routes = [
  {path: '', component: CcpaDsarComponent,  canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [CcpaDsarComponent],
    imports: [
        CommonModule,
        SharedbootstrapModule,
        RouterModule.forChild(routes),
        BsDropdownModule,
      ChartsModule
    ]
})
export class CcpaDsarModule { }
