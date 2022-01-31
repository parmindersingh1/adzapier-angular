import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuickstartalertComponent} from '../../_components/quickstartalert/quickstartalert.component'

@NgModule({
  declarations: [QuickstartalertComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[QuickstartalertComponent]
})
export class QuickstartalertModule { }
