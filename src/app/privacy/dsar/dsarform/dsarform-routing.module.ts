import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DsarformComponent } from './dsarform.component';
import { AuthGuard } from 'src/app/_helpers';
import { DirtyCheckGuard } from 'src/app/guards/dirty-check.guards';
import {RouteguardService} from '../../../_services/routeguard.service'

const routes: Routes = [
  { path: '', component: DsarformComponent, canDeactivate:[DirtyCheckGuard], canActivate: [AuthGuard,RouteguardService] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DsarformRoutingModule { }
