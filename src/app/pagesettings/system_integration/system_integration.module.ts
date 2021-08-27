import {NgModule} from '@angular/core';
import {SystemIntegrationComponent} from './system_integration.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedbootstrapModule} from '../../sharedbootstrap/sharedbootstrap.module';
import { MysqlFormComponent } from './mysql-form/mysql-form.component';
import {TableModule} from 'primeng/table';
import { ConnectionFormComponent } from './connection-form/connection-form.component';


const router: Routes = [
  { path : '', component: SystemIntegrationComponent}
];

@NgModule({
  declarations: [SystemIntegrationComponent, MysqlFormComponent, ConnectionFormComponent],
    imports: [RouterModule.forChild(router), ReactiveFormsModule, SharedbootstrapModule, TableModule, FormsModule]
})

export class SystemIntegrationModule{}
