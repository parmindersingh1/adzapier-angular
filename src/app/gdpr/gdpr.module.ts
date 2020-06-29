import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GDPRComponent } from './gdpr.component';
import { GdprRoutingModule } from './gdpr-routing.module';



@NgModule({
  declarations: [GDPRComponent],
  imports: [
    CommonModule,
    GdprRoutingModule
  ]
})
export class GdprModule { }
