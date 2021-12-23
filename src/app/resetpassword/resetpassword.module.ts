import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ResetpasswordRoutingModule } from './resetpassword-routing.module';
import { SharedbootstrapModule } from '../sharedbootstrap/sharedbootstrap.module';
import { ResetpasswordComponent } from './resetpassword.component';


@NgModule({
  declarations: [ResetpasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedbootstrapModule,
    ResetpasswordRoutingModule
  ]
})
export class ResetpasswordModule { }
