import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdateBillingRoutingModule } from './update-billing-routing.module';
import { UpdateBillingComponent } from './update-billing.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';

@NgModule({
  declarations: [UpdateBillingComponent],
  imports: [
    CommonModule,
    UpdateBillingRoutingModule,
    SimpleNotificationsModule.forRoot(),
    SharedbootstrapModule
  ],
  exports: [SimpleNotificationsModule]
})
export class UpdateBillingModule { }
