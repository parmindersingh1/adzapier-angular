import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AlertConfig, AlertModule} from 'ngx-bootstrap';



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
  ],
  providers: [AlertConfig]
})
export class LoginModule { }
