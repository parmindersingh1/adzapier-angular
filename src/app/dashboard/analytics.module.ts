import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './analytics.component';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import {CcpaDsarComponent} from "./ccpa-dsar/ccpa-dsar.component";
import { ChartsModule } from 'ng2-charts';
import {SharedbootstrapModule} from "../sharedbootstrap/sharedbootstrap.module";
// import {TimeAgoPipe} from "time-ago-pipe";

@NgModule({
  declarations: [AnalyticsComponent, CcpaDsarComponent],
  imports: [
    CommonModule,
    ChartsModule,
    FeatherModule.pick(allIcons),
    SharedbootstrapModule,
    AnalyticsRoutingModule
  ]
})
export class AnalyticsModule { }
