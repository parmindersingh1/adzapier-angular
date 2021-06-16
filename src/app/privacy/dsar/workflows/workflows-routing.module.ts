import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkflowsComponent } from './workflows.component';
import { AuthGuard } from 'src/app/_helpers';
import { RouteguardService } from 'src/app/_services/routeguard.service';
import { DirtyCheckGuard } from 'src/app/guards/dirty-check.guards';


const routes: Routes = [{path: '', component: WorkflowsComponent,  canDeactivate:[DirtyCheckGuard], canActivate: [AuthGuard,RouteguardService]},

{ path: 'privacy/dsar/createworkflow/:id', loadChildren: () => import(`../createworkflow/createworkflow.module`)
  .then(m => m.CreateworkflowModule),canDeactivate: [DirtyCheckGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowsRoutingModule { }
