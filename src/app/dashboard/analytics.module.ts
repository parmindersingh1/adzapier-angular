import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './analytics.component';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import {SharedbootstrapModule} from '../sharedbootstrap/sharedbootstrap.module';

@NgModule({
  declarations: [AnalyticsComponent],
  imports: [
    CommonModule,
    FeatherModule.pick(allIcons),
    SharedbootstrapModule,
    AnalyticsRoutingModule
  ]
})
export class AnalyticsModule { }
