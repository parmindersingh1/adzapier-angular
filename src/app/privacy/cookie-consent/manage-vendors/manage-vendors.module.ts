import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ManageVendorsComponent} from './manage-vendors.component';
import { RouterModule, Routes} from '@angular/router';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {TabViewModule} from 'primeng/tabview';
import {AlertModule} from 'ngx-bootstrap/alert';
import {TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';

const path: Routes = [
  {path : '', component: ManageVendorsComponent}
]


@NgModule({
  declarations: [ManageVendorsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(path),
    TabsModule,
    NgxSkeletonLoaderModule,
    TabViewModule,
    AlertModule,
    TableModule,
    FormsModule
  ]
})
export class ManageVendorsModule { }
