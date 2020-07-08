import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AnalyticsComponent} from "../analytics.component";
import {AuthGuard} from "../../_helpers";
import {CcpaDsarComponent} from "./ccpa-dsar.component";
import {SharedbootstrapModule} from "../../sharedbootstrap/sharedbootstrap.module";
import {ChartsModule} from "ng2-charts";

const routes: Routes = [
  {path: '', component: CcpaDsarComponent,  canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [CcpaDsarComponent],
  imports: [
    CommonModule,
    SharedbootstrapModule,
    ChartsModule,
  RouterModule.forChild(routes),
]
})
export class CcpaDsarModule { }
