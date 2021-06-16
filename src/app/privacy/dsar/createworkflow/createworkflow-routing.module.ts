import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateworkflowComponent } from './createworkflow.component';
import { AuthGuard } from 'src/app/_helpers';
import { RouteguardService } from 'src/app/_services/routeguard.service';
import { DirtyCheckGuard } from 'src/app/guards/dirty-check.guards';


const routes: Routes = [{path:'', component:CreateworkflowComponent,  canActivate: [AuthGuard,RouteguardService], canDeactivate:[DirtyCheckGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateworkflowRoutingModule { }
