import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareIconWrapperComponent } from './share-icon-component/ShareIconWrapperComponent';
import { ShareRoutingModule } from './share-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {AlertModule} from 'ngx-bootstrap';
import { SharedbootstrapModule } from '../sharedbootstrap/sharedbootstrap.module';
import { ShareComponent } from './share.component'
// import { ToggleDirective } from '../_pipe/toggle.pipe';
// import {AlertConfig, AlertModule} from 'ngx-bootstrap';



@NgModule({
  declarations:[ShareIconWrapperComponent, ShareComponent],
  imports: [
    CommonModule,
    ShareRoutingModule,
    FormsModule,
    ReactiveFormsModule,
   // AlertModule,
    SharedbootstrapModule,
    // NgxPasswordToggleModule
  ],
  providers: []
})
export class ShareModule { }
