import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageProductComponent } from './manage-product.component';
import {RouterModule, Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

const path: Routes = [
  {path: '', component: ManageProductComponent}
];

@NgModule({
  declarations: [ManageProductComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedbootstrapModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    NgbModule,
    RouterModule.forChild(path)
  ]
})
export class ManageProductModule { }
