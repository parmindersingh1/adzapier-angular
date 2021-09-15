import { NgModule } from '@angular/core';
import { DsarRequestdetailsRoutingModule } from './dsar-requestdetails-routing.module';
import { DsarRequestdetailsComponent } from './dsar-requestdetails.component';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { DsarConnectionListComponent } from './dsar-connection-list/dsar-connection-list.component';
import {TableModule} from 'primeng/table';

@NgModule({
  declarations: [DsarRequestdetailsComponent, DsarConnectionListComponent],
    imports: [
        SharedbootstrapModule,
        FormsModule, ReactiveFormsModule,
        DsarRequestdetailsRoutingModule,
        FeatherModule.pick(allIcons), TableModule,
    ]
})
export class DsarRequestdetailsModule { }
