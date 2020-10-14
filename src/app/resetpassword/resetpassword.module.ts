import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ResetpasswordRoutingModule } from './resetpassword-routing.module';
import { ResetpasswordComponent } from './resetpassword.component';


@NgModule({
  declarations: [ResetpasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ResetpasswordRoutingModule
  ]
})
export class ResetpasswordModule { }
