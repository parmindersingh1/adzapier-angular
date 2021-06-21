import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ConsentTableComponent} from './consent-table/consent-table.component';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {ConsentDetailsComponent} from './consent-table/consent-details/consent-details.component';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TabViewModule} from 'primeng/tabview';
import { ModalModule } from 'ngx-bootstrap/modal';




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
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    SharedbootstrapModule,
    RadioButtonModule,
    TabViewModule,
    ModalModule
  ]
})
export class ConsentSolutionsModule {
}
