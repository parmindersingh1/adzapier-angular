import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageProductComponent } from './manage-product.component';
import {RouterModule, Routes} from '@angular/router';

const path: Routes = [
  {path: '', component: ManageProductComponent}
];

@NgModule({
  declarations: [ManageProductComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(path)
  ]
})
export class ManageProductModule { }
