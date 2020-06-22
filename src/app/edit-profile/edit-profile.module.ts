import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EditProfileRoutingModule } from './edit-profile-routing.module';
import { EditProfileComponent } from './edit-profile.component';
import { SharedbootstrapModule } from '../sharedbootstrap/sharedbootstrap.module';



@NgModule({
  declarations: [EditProfileComponent],
  imports: [
    CommonModule,
    EditProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedbootstrapModule
  ]
})
export class EditProfileModule { }
