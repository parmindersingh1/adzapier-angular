import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateworkflowRoutingModule } from './createworkflow-routing.module';
import { CreateworkflowComponent } from './createworkflow.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';

@NgModule({
  declarations: [CreateworkflowComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CreateworkflowRoutingModule,
    SharedbootstrapModule
  ]
})
export class CreateworkflowModule { }
