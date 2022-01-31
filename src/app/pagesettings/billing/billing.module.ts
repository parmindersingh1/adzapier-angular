import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillingRoutingModule } from './billing-routing.module';
import { BillingComponent } from './billing.component';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
@NgModule({
  declarations: [BillingComponent],
  imports: [
    CommonModule,
    BillingRoutingModule,
    SharedbootstrapModule
  ]
})
export class BillingModule { }
