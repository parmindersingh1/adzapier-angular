import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DsarRequestsRoutingModule } from './dsar-requests-routing.module';
import { DsarRequestsComponent } from './dsar-requests.component';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  declarations: [DsarRequestsComponent],
  imports: [
    SharedbootstrapModule,
    FormsModule, ReactiveFormsModule,
    DsarRequestsRoutingModule,
    TableModule,
    MultiSelectModule
  ],
  exports: []
})
export class DsarRequestsModule { }
