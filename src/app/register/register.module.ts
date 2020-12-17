import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import {AlertConfig, AlertModule} from 'ngx-bootstrap/alert';
import { ToggleDirective } from '../_pipe/toggle.pipe';

@NgModule({
  declarations: [RegisterComponent, ToggleDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RegisterRoutingModule,
    AlertModule,
  ],
  providers: [AlertConfig]
})
export class RegisterModule { }
