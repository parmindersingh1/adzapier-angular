import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GethelpRoutingModule } from './gethelp-routing.module';
import { GethelpComponent } from './gethelp.component';


@NgModule({
  declarations: [GethelpComponent],
  imports: [
    CommonModule,
    GethelpRoutingModule
  ]
})
export class GethelpModule { }
