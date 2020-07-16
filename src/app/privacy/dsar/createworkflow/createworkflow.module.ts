import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateworkflowRoutingModule } from './createworkflow-routing.module';
import { CreateworkflowComponent } from './createworkflow.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import {CustomtabsComponent} from 'src/app/_components/customtabs/customtabs.component';
@NgModule({
  declarations: [CreateworkflowComponent,CustomtabsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CreateworkflowRoutingModule,
    SharedbootstrapModule
  ]
})
export class CreateworkflowModule { }
