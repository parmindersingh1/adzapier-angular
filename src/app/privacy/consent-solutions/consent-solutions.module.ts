import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ConsentTableComponent} from './consent-table/consent-table.component';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {TableModule} from 'primeng/table';

const path: Routes = [
  { path: 'data', component: ConsentTableComponent}
];

@NgModule({
  declarations: [ConsentTableComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(path),
    TabsModule,
    TableModule
  ]
})
export class ConsentSolutionsModule { }
