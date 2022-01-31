import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PricingRoutingModule } from './pricing-routing.module';
import { PricingComponent } from './pricing.component';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {FormsModule} from '@angular/forms';
import { QuickstartalertModule } from 'src/app/_components/quickstartalert/quickstartalert.module';
@NgModule({
  declarations: [PricingComponent],
    imports: [
        CommonModule,
        PricingRoutingModule,
        SharedbootstrapModule,
        BsDropdownModule,
        FormsModule,
        QuickstartalertModule
    ]
})
export class PricingModule { }
