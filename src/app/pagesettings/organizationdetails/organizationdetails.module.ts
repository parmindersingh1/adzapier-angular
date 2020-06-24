import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { OrganizationdetailsRoutingModule } from './organizationdetails-routing.module';
import { OrganizationdetailsComponent } from './organizationdetails.component';


@NgModule({
  declarations: [OrganizationdetailsComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    SharedbootstrapModule,
    OrganizationdetailsRoutingModule
  ]
})
export class OrganizationdetailsModule { }
