import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { WorkflowsRoutingModule } from './workflows-routing.module';
import { WorkflowsComponent } from './workflows.component';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

@NgModule({
  declarations: [WorkflowsComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    SharedbootstrapModule,
    WorkflowsRoutingModule,
    TableModule,
    MultiSelectModule,
    FeatherModule.pick(allIcons)
  ]
})
export class WorkflowsModule { }
