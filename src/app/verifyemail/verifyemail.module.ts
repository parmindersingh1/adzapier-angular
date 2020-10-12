import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifyemailRoutingModule } from './verifyemail-routing.module';
import { VerifyemailComponent } from './verifyemail.component';


@NgModule({
  declarations: [VerifyemailComponent],
  imports: [
    CommonModule,
    VerifyemailRoutingModule
  ]
})
export class VerifyemailModule { }
