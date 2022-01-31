import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignoutPageRoutingModule } from './signout-page-routing.module';
import { SignoutPageComponent } from './signout-page.component';


@NgModule({
  declarations: [SignoutPageComponent],
  imports: [
    CommonModule,
    SignoutPageRoutingModule
  ]
})
export class SignoutPageModule { }
