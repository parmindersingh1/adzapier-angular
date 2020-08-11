import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import {NgxPasswordToggleModule} from "ngx-password-toggle";
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';

@NgModule({
  declarations: [RegisterComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RegisterRoutingModule,
        NgxPasswordToggleModule,
        SharedbootstrapModule
    ]
})
export class RegisterModule { }
