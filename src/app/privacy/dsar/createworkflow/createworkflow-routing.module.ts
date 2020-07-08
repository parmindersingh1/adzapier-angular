import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateworkflowComponent } from './createworkflow.component';
import { AuthGuard } from 'src/app/_helpers';


const routes: Routes = [{path:'', component:CreateworkflowComponent,  canActivate: [AuthGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateworkflowRoutingModule { }
