import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdateBillingRoutingModule } from './update-billing-routing.module';
import { UpdateBillingComponent } from './update-billing.component';
import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
  declarations: [UpdateBillingComponent],
  imports: [
    CommonModule,
    UpdateBillingRoutingModule,
    SimpleNotificationsModule.forRoot()
  ],
  exports: [SimpleNotificationsModule]
})
export class UpdateBillingModule { }
