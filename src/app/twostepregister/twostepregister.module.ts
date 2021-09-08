import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {AlertConfig, AlertModule} from 'ngx-bootstrap/alert';
import { TwostepregisterRoutingModule } from './twostepregister-routing.module';
import { TwostepregisterComponent } from './twostepregister.component';


@NgModule({
  declarations: [TwostepregisterComponent],
  imports: [
    CommonModule,
    TwostepregisterRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AlertModule,
  ],
  providers: [AlertConfig]
})
export class TwostepregisterModule { }
