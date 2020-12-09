import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { HeaderComponent } from './header.component';
import { HeaderRoutingModule } from './header-routing.module';
import {ScrollingModule} from '@angular/cdk/scrolling';

@NgModule({
    declarations: [HeaderComponent],
      imports: [
          CommonModule,
          SharedbootstrapModule,
          HeaderRoutingModule,
          ScrollingModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      exports: [SharedbootstrapModule, ScrollingModule, HeaderComponent]
  })
  export class HeaderModule { }