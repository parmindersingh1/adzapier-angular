import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ConsentTableComponent} from './consent-table/consent-table.component';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {ConsentDetailsComponent} from './consent-table/consent-details/consent-details.component';

const path: Routes = [
  {path: 'consent-records', component: ConsentTableComponent},
  {path: 'consent-records/details/:id', component: ConsentDetailsComponent}
];

@NgModule({
  declarations: [ConsentTableComponent, ConsentDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(path),
    TabsModule,
    TableModule,
    ButtonModule
  ]
})
export class ConsentSolutionsModule {
}
