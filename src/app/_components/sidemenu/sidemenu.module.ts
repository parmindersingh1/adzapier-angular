import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidemenuComponent} from '../../_components/sidemenu/sidemenu.component'
@NgModule({
  declarations: [SidemenuComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[SidemenuComponent]
})
export class SidemenuModule { }
