import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { WebformsRoutingModule } from './webforms-routing.module';
import { WebformsComponent } from './webforms.component';


@NgModule({
  declarations: [WebformsComponent],
  imports: [
    CommonModule,
    FeatherModule.pick(allIcons),
    WebformsRoutingModule
  ]
})
export class WebformsModule { }
