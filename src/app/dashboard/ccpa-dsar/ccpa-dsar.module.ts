import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../_helpers';
import {CcpaDsarComponent} from './ccpa-dsar.component';
import {ChartsModule, ThemeService} from 'ng2-charts';
import {SharedbootstrapModule} from '../../sharedbootstrap/sharedbootstrap.module';
import {LicenseguardService} from '../../_services/licenseguard.service';
import {RouteguardService} from '../../_services/routeguard.service'

const routes: Routes = [
  {path: '', component: CcpaDsarComponent,  canActivate: [AuthGuard, RouteguardService, LicenseguardService]}
];

@NgModule({
  declarations: [CcpaDsarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedbootstrapModule,
    ChartsModule,
  ],
  providers: [ThemeService]
})
export class CcpaDsarModule { }
