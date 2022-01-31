import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { InviteuserpasswordRoutingModule } from './inviteuserpassword-routing.module';
import { InviteuserpasswordComponent } from './inviteuserpassword.component';
import { SharedbootstrapModule } from '../sharedbootstrap/sharedbootstrap.module';



@NgModule({
  declarations: [InviteuserpasswordComponent],
  imports: [
    CommonModule,
    InviteuserpasswordRoutingModule,
    SharedbootstrapModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class InviteuserpasswordModule { }
