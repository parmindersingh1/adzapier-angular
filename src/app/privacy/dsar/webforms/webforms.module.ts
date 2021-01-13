import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { WebformsRoutingModule } from './webforms-routing.module';
import { WebformsComponent } from './webforms.component';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';


@NgModule({
  declarations: [WebformsComponent],
  imports: [
    FeatherModule.pick(allIcons),
    WebformsRoutingModule,
    SharedbootstrapModule
  ]
})
export class WebformsModule { }
