import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NgbModal, NgbModule, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DsarformComponent } from './dsarform.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DsarformRoutingModule } from './dsarform-routing.module';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedbootstrapModule } from '../sharedbootstrap/sharedbootstrap.module';


@NgModule({
  declarations: [DsarformComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  //  DragDropModule,
   // NgbModule, NgbModal,
    DsarformRoutingModule,
   // QuillModule,
    SharedbootstrapModule
  ],
 // providers:[NgbModule, NgbModal],
  exports: [
    // NgbModule, NgbModal,
    SharedbootstrapModule,
     DsarformComponent],
    bootstrap: [DsarformComponent]
})
export class DsarformModule {
  
 }
