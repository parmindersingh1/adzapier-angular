import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NgbModal, NgbModule, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DsarformComponent } from './dsarform.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DsarformRoutingModule } from './dsarform-routing.module';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { BotDetectCaptchaModule } from 'angular-captcha';


@NgModule({
  declarations: [DsarformComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  //  DragDropModule,
   // NgbModule, NgbModal,
    DsarformRoutingModule,
    QuillModule.forRoot(),
    SharedbootstrapModule,
    BotDetectCaptchaModule
  ]
 // providers:[NgbModule, NgbModal],
 
})
export class DsarformModule {
  
 }
