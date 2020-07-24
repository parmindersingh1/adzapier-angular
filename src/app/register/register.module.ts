import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import {NgxPasswordToggleModule} from "ngx-password-toggle";


@NgModule({
  declarations: [RegisterComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RegisterRoutingModule,
        NgxPasswordToggleModule
    ]
})
export class RegisterModule { }
