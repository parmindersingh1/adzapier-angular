import {NgModule} from '@angular/core';
import {SystemIntegrationComponent} from './system_integration.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedbootstrapModule} from '../../sharedbootstrap/sharedbootstrap.module';
import { MysqlFormComponent } from './mysql-form/mysql-form.component';
import {TableModule} from 'primeng/table';
import { ConnectionFormComponent } from './connection-form/connection-form.component';
import { UpdateConnectionFormComponent } from './update-connection-form/update-connection-form.component';
import {SkeletonModule} from 'primeng/skeleton';
import {HttpQueryBuilderComponent} from '../../privacy/dsar/dsarform/dsar-system/http-query-builder/http-query-builder.component';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import { AuthGuard } from 'src/app/_helpers';


const router: Routes = [
  { path : '', component: SystemIntegrationComponent,canActivate:[AuthGuard]}
];

@NgModule({
    declarations: [SystemIntegrationComponent, MysqlFormComponent, ConnectionFormComponent, UpdateConnectionFormComponent, HttpQueryBuilderComponent],
  exports: [
    MysqlFormComponent,
    HttpQueryBuilderComponent
  ],
  imports: [RouterModule.forChild(router),         ReactiveFormsModule, SharedbootstrapModule, TableModule, FormsModule, SkeletonModule, ButtonModule, RippleModule]
})

export class SystemIntegrationModule{}
