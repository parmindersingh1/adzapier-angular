import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DsarRequestdetailsRoutingModule } from './dsar-requestdetails-routing.module';
import { DsarRequestdetailsComponent } from './dsar-requestdetails.component';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

@NgModule({
  declarations: [DsarRequestdetailsComponent],
  imports: [
    CommonModule,
    SharedbootstrapModule,
    FormsModule, ReactiveFormsModule,
    DsarRequestdetailsRoutingModule,
    FeatherModule.pick(allIcons),
  ]
})
export class DsarRequestdetailsModule { }
