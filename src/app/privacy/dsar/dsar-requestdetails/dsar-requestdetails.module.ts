import { NgModule } from '@angular/core';
import { DsarRequestdetailsRoutingModule } from './dsar-requestdetails-routing.module';
import { DsarRequestdetailsComponent } from './dsar-requestdetails.component';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { DsarConnectionListComponent } from './dsar-connection-list/dsar-connection-list.component';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import { EmailConnectionListComponent } from './dsar-connection-list/email-connection-list/email-connection-list.component';
import { MailchimpConnectionListComponent } from './dsar-connection-list/mailchimp-connection-list/mailchimp-connection-list.component';
import { MoosendConnectionListComponent } from './dsar-connection-list/moosend-connection-list/moosend-connection-list.component';
import { SendgridConnectionListComponent } from './dsar-connection-list/sendgrid-connection-list/sendgrid-connection-list.component';
import { HubspotConnectionListComponent } from './dsar-connection-list/hubspot-connection-list/hubspot-connection-list.component';
import { RestapiConnectionListComponent } from './dsar-connection-list/restapi-connection-list/restapi-connection-list.component';

@NgModule({
  declarations: [DsarRequestdetailsComponent, DsarConnectionListComponent, EmailConnectionListComponent, MailchimpConnectionListComponent, MoosendConnectionListComponent, SendgridConnectionListComponent, HubspotConnectionListComponent, RestapiConnectionListComponent],
  imports: [
    SharedbootstrapModule,
    FormsModule, ReactiveFormsModule,
    DsarRequestdetailsRoutingModule,
    FeatherModule.pick(allIcons), TableModule, ButtonModule, RippleModule,
  ]
})
export class DsarRequestdetailsModule { }
