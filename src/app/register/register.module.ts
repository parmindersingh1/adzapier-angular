import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';

@NgModule({
  declarations: [RegisterComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RegisterRoutingModule,
        SharedbootstrapModule
    ]
})
export class RegisterModule { }
