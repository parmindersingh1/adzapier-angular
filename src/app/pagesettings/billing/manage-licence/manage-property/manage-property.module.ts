import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  ManagePropertyComponent } from './manage-property.component';
import {RouterModule, Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';

const path: Routes = [
  {path: '', component: ManagePropertyComponent}
];

@NgModule({
  declarations: [ManagePropertyComponent],
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
export class ManagePropertyModule { }
