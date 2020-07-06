import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkflowsComponent } from './workflows.component';
import { AuthGuard } from 'src/app/_helpers';


const routes: Routes = [{path: '', component: WorkflowsComponent, canActivate: [AuthGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowsRoutingModule { }
