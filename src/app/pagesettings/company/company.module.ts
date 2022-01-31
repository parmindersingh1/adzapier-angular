import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { QuickstartalertModule } from 'src/app/_components/quickstartalert/quickstartalert.module';
//import { QuickstartalertComponent} from '../../_components/quickstartalert/quickstartalert.component'

@NgModule({
  declarations: [CompanyComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedbootstrapModule,
    CompanyRoutingModule,
    QuickstartalertModule
  ]
})
export class CompanyModule { }
