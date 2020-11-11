import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import {NgxPasswordToggleModule} from 'ngx-password-toggle';
import {AlertModule} from 'ngx-bootstrap';

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RegisterRoutingModule,
    AlertModule,
    // SharedbootstrapModule,
    // NgxPasswordToggleModule
  ]
})
export class RegisterModule { }
