import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { WorkflowsRoutingModule } from './workflows-routing.module';
import { WorkflowsComponent } from './workflows.component';


@NgModule({
  declarations: [WorkflowsComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    SharedbootstrapModule,
    WorkflowsRoutingModule
  ]
})
export class WorkflowsModule { }
