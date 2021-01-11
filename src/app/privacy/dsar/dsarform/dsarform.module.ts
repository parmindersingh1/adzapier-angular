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

@NgModule({
  declarations: [DsarformComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
  //  DragDropModule,
   // NgbModule, NgbModal,
    DsarformRoutingModule,
    QuillModule.forRoot(),
    NgbModule,
    SharedbootstrapModule,
    FeatherModule.pick(allIcons)
  ]
 // providers:[NgbModule, NgbModal],

})
export class DsarformModule { }
