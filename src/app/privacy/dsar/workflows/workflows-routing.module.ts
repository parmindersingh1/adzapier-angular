import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkflowsComponent } from './workflows.component';
import { AuthGuard } from 'src/app/_helpers';
import { RouteguardService } from 'src/app/_services/routeguard.service';


const routes: Routes = [{path: '', component: WorkflowsComponent, canActivate: [AuthGuard,RouteguardService]},

{ path: 'privacy/dsar/createworkflow/:id', loadChildren: () => import(`../createworkflow/createworkflow.module`)
  .then(m => m.CreateworkflowModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowsRoutingModule { }
