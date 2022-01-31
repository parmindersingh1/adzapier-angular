import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { ManageLicenceComponent } from './manage-licence.component';
import {ButtonModule} from 'primeng/button';
import {MultiSelectModule} from 'primeng/multiselect';
import {ReactiveFormsModule} from '@angular/forms';
import { QuickstartalertModule } from 'src/app/_components/quickstartalert/quickstartalert.module';

const paths: Routes = [
  {path: '', component: ManageLicenceComponent },
  {path: 'organizations/:id', loadChildren: () => import('./manage-organization/manage-organization.module').then(m => m.ManageOrganizationModule)},
  {path: 'property/:id', loadChildren: () => import('./manage-property/manage-property.module').then(m => m.ManagePropertyModule)},

];
@NgModule({
  declarations: [ManageLicenceComponent],
  imports: [
    CommonModule,
    SharedbootstrapModule,
    RouterModule.forChild(paths),
    ButtonModule,
    MultiSelectModule,
    ReactiveFormsModule,
    QuickstartalertModule
  ]
})
export class ManageLicenceModule { }
