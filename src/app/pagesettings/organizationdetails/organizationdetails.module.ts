import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { OrganizationdetailsRoutingModule } from './organizationdetails-routing.module';
import { OrganizationdetailsComponent } from './organizationdetails.component';
import { QuickstartalertModule } from 'src/app/_components/quickstartalert/quickstartalert.module';

@NgModule({
  declarations: [OrganizationdetailsComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    QuickstartalertModule,
    SharedbootstrapModule,
    OrganizationdetailsRoutingModule
  ]
})
export class OrganizationdetailsModule { }
