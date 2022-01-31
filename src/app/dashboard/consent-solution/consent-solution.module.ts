import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ConsentSolutionComponent} from './consent-solution.component';
import {ChartsModule} from 'ng2-charts';
import {AuthGuard} from '../../_helpers';
import {RouteguardService} from '../../_services/routeguard.service';
import { LicenseGuardConsentPreferenceService } from '../../_services/licenseguardconsentpreference.service';
const path: Routes = [
  {path: '', component: ConsentSolutionComponent, canActivate: [AuthGuard, RouteguardService, LicenseGuardConsentPreferenceService]}
];

@NgModule({
  declarations: [ConsentSolutionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(path),
    ChartsModule
  ]
})
export class ConsentSolutionModule { }
