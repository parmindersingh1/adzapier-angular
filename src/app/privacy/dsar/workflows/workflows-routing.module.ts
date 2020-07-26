import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkflowsComponent } from './workflows.component';
import { AuthGuard } from 'src/app/_helpers';


const routes: Routes = [{path: '', component: WorkflowsComponent, canActivate: [AuthGuard]},

{ path: 'privacy/dsar/createworkflow/:id', loadChildren: () => import(`../createworkflow/createworkflow.module`)
  .then(m => m.CreateworkflowModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowsRoutingModule { }
