import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationteamRoutingModule } from './organizationteam-routing.module';
import { OrganizationteamComponent } from './organizationteam.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
// import {TimeAgoPipe} from 'time-ago-pipe';

@NgModule({
  declarations: [OrganizationteamComponent ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedbootstrapModule,
    OrganizationteamRoutingModule
  ],
  exports: [ ]
})
export class OrganizationteamModule { }
