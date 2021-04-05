import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ConsentTableComponent} from './consent-table/consent-table.component';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import { ConsentlegalTableComponent } from './consentlegal-table/consentlegal-table.component';

const path: Routes = [
  { path: 'data', component: ConsentTableComponent},
  { path:'datas', component:ConsentlegalTableComponent}
];

@NgModule({
  declarations: [ConsentTableComponent, ConsentlegalTableComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(path),
    TabsModule,
    TableModule,
    ButtonModule
  ]
})
export class ConsentSolutionsModule { }
