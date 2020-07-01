import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillingRoutingModule } from './billing-routing.module';
import { BillingComponent } from './billing.component';
import { UpdateBillingComponent } from '../update-billing/update-billing.component';
// import {UpdateBillingComponent} from "../../update-billing/update-billing.component";


@NgModule({
  declarations: [BillingComponent, UpdateBillingComponent],
  imports: [
    CommonModule,
    BillingRoutingModule
  ]
})
export class BillingModule { }
