import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorpageRoutingModule } from './errorpage-routing.module';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { InternalerrorComponent } from './internalserver/internalerror.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';


@NgModule({
  declarations: [PagenotfoundComponent, InternalerrorComponent, UnauthorizedComponent, ForbiddenComponent],
  imports: [
    CommonModule,
    ErrorpageRoutingModule
  ]
})
export class ErrorpageModule { }
