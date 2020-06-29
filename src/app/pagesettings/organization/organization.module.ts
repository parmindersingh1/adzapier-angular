import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationRoutingModule } from './organization-routing.module';
import { OrgpageComponent } from './orgpage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';

@NgModule({
  declarations: [OrgpageComponent],
  imports: [
    CommonModule,
    SharedbootstrapModule,
    FormsModule, ReactiveFormsModule,
    OrganizationRoutingModule
  ]
})
export class OrganizationModule { }
