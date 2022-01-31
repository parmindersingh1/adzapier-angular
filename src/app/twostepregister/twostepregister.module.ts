import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {AlertConfig, AlertModule} from 'ngx-bootstrap/alert';
import { TwostepregisterRoutingModule } from './twostepregister-routing.module';
import { TwostepregisterComponent } from './twostepregister.component';
import { ToggleDirective } from '../_pipe/toggle.pipe';
import {DropdownModule} from 'primeng/dropdown';




@NgModule({
  declarations: [TwostepregisterComponent,ToggleDirective],
  imports: [
    CommonModule,
    TwostepregisterRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AlertModule,
    DropdownModule
  ],
  providers: [AlertConfig]
})
export class TwostepregisterModule { }
