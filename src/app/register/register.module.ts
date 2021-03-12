import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import {AlertConfig, AlertModule} from 'ngx-bootstrap/alert';
import { ToggleDirective } from '../_pipe/toggle.pipe';
import { ThankyoupageComponent } from './thankyoupage.component';

@NgModule({
  declarations: [RegisterComponent, ToggleDirective, ThankyoupageComponent],
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
