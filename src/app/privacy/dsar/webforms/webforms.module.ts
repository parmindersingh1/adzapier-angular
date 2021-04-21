import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { WebformsRoutingModule } from './webforms-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebformsComponent } from './webforms.component';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { CustomcardsComponent } from 'src/app/_components/customcards/customcards.component';
import { CustompaginationComponent } from 'src/app/_components/custompagination/custompagination.component';


@NgModule({
  declarations: [WebformsComponent,CustomcardsComponent,CustompaginationComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FeatherModule.pick(allIcons),
    WebformsRoutingModule,
    SharedbootstrapModule
  ]
})
export class WebformsModule { }
