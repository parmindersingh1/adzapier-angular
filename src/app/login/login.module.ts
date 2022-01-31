import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {AlertModule} from 'ngx-bootstrap';
import { SharedbootstrapModule } from '../sharedbootstrap/sharedbootstrap.module';
import {ToggleDirective} from '../_pipe/toggle.pipe';
import {TogglePasswordPipe} from '../_pipe/toggle-password.pipe';
// import { ToggleDirective } from '../_pipe/toggle.pipe';
// import {AlertConfig, AlertModule} from 'ngx-bootstrap';



@NgModule({
  declarations: [LoginComponent, TogglePasswordPipe],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
   // AlertModule,
    SharedbootstrapModule,
    // NgxPasswordToggleModule
  ],
  providers: []
})
export class LoginModule { }
