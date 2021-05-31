import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateworkflowComponent } from './createworkflow.component';
import { AuthGuard } from 'src/app/_helpers';
import { RouteguardService } from 'src/app/_services/routeguard.service';


const routes: Routes = [{path:'', component:CreateworkflowComponent,  canActivate: [AuthGuard,RouteguardService]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateworkflowRoutingModule { }
