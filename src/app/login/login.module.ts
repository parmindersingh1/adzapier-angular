import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import {NgxPasswordToggleModule} from 'ngx-password-toggle';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AlertModule} from 'ngx-bootstrap';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    // SharedbootstrapModule,
    // NgxPasswordToggleModule
  ]
})
export class LoginModule { }
