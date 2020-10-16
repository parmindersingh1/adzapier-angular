import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import {NgxPasswordToggleModule} from 'ngx-password-toggle';



@NgModule({
  declarations: [LoginComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        LoginRoutingModule,
        SharedbootstrapModule,
        NgxPasswordToggleModule
    ]
})
export class LoginModule { }
