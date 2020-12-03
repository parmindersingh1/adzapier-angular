import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { HeaderComponent } from './header.component';
import { HeaderRoutingModule } from './header-routing.module';
import { TimeAgoPipe } from 'time-ago-pipe';

@NgModule({
    declarations: [HeaderComponent],
      imports: [
          CommonModule,
          SharedbootstrapModule,
          HeaderRoutingModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      exports: [SharedbootstrapModule, HeaderComponent]
  })
  export class HeaderModule { }