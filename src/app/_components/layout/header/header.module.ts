import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { HeaderComponent } from './header.component';
import { HeaderRoutingModule } from './header-routing.module';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QuickstartalertModule } from 'src/app/_components/quickstartalert/quickstartalert.module';
import {DropdownModule} from 'primeng/dropdown';


@NgModule({
    declarations: [HeaderComponent],
      imports: [
          CommonModule,
          SharedbootstrapModule,
          HeaderRoutingModule,
          ScrollingModule,
          QuickstartalertModule,
          DropdownModule,
          ReactiveFormsModule,
          FormsModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      exports: [SharedbootstrapModule, ScrollingModule, HeaderComponent]
  })
  export class HeaderModule { }