import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { OrganizationRoutingModule } from './organization-routing.module';
import { OrgpageComponent } from './orgpage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
//import { QuickstartalertComponent } from 'src/app/_components/quickstartalert/quickstartalert.component'
import { QuickstartalertComponent} from '../../_components/quickstartalert/quickstartalert.component'
import { QuickstartalertModule } from 'src/app/_components/quickstartalert/quickstartalert.module';
@NgModule({
  declarations: [OrgpageComponent],
  imports: [
    CommonModule,
    SharedbootstrapModule,
    QuickstartalertModule,
    FormsModule, ReactiveFormsModule,
    OrganizationRoutingModule,
    FeatherModule.pick(allIcons)
  ]
})
export class OrganizationModule { }
