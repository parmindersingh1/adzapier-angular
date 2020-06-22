import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
