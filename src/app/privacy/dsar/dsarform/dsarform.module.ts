import { NgModule } from '@angular/core';
// import { NgbModal, NgbModule, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DsarformComponent } from './dsarform.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DsarformRoutingModule } from './dsarform-routing.module';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { HeaderComponent } from 'src/app/_components/layout/header/header.component';
import {DsarSystemComponent} from './dsar-system/dsar-system.component';
import {SqlQueryBuilderComponent} from './dsar-system/sql-query-builder/sql-query-builder.component';
import {TableModule} from 'primeng/table';
import {QueryBuilderModule} from 'angular2-query-builder';
import { MailchimpQueryBuilderComponent } from './dsar-system/mailchimp-query-builder/mailchimp-query-builder.component';
import {SkeletonModule} from 'primeng/skeleton';
import {SystemIntegrationModule} from '../../../pagesettings/system_integration/system_integration.module';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';

@NgModule({
  declarations: [DsarformComponent, DsarSystemComponent, SqlQueryBuilderComponent, MailchimpQueryBuilderComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    //  DragDropModule,
    // NgbModule, NgbModal,
    DsarformRoutingModule,
    QuillModule.forRoot(),
    NgbModule,
    SharedbootstrapModule,
    FeatherModule.pick(allIcons),
    TableModule,
    QueryBuilderModule,
    SkeletonModule,
    SystemIntegrationModule,
    ButtonModule,
    RippleModule
  ]
  // providers:[NgbModule, NgbModal],

})
export class DsarformModule { }
