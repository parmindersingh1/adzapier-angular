import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DsarRequestsRoutingModule } from './dsar-requests-routing.module';
import { DsarRequestsComponent } from './dsar-requests.component';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { DataTableModule } from 'ng-mazdik-lib';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  declarations: [DsarRequestsComponent],
  imports: [
    CommonModule,
    SharedbootstrapModule,
    FormsModule, ReactiveFormsModule,
    DsarRequestsRoutingModule,
    DataTableModule,
    TableModule,
    MultiSelectModule
  ],
  exports: []
})
export class DsarRequestsModule { }
