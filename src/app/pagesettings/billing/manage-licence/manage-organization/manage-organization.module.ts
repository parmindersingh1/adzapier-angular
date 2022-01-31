import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageOrganizationComponent } from './manage-organization.component';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const path:Routes = [
  {path: '', component: ManageOrganizationComponent}
]

@NgModule({
  declarations: [ManageOrganizationComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedbootstrapModule,
    ReactiveFormsModule,
    MultiSelectModule,
    BsDropdownModule.forRoot(),
    NgbModule,
    RouterModule.forChild(path)
  ]
})
export class ManageOrganizationModule { }
