import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { ForgotpasswordRoutingModule } from './forgotpassword-routing.module';
import { ForgotpasswordComponent } from './forgotpassword.component';


@NgModule({
  declarations: [ForgotpasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ForgotpasswordRoutingModule,
    SharedbootstrapModule
  ]
})
export class ForgotpasswordModule { }