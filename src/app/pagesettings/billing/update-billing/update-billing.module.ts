import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdateBillingRoutingModule } from './update-billing-routing.module';
import { UpdateBillingComponent } from './update-billing.component';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';

@NgModule({
  declarations: [UpdateBillingComponent],
  imports: [
    CommonModule,
    UpdateBillingRoutingModule,
    SharedbootstrapModule
  ],
})
export class UpdateBillingModule { }
