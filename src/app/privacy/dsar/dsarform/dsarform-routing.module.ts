import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DsarformComponent } from './dsarform.component';
import { AuthGuard } from 'src/app/_helpers';
import { DirtyCheckGuard } from 'src/app/guards/dirty-check.guards';

const routes: Routes = [
  { path: '', component: DsarformComponent, canDeactivate:[DirtyCheckGuard], canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DsarformRoutingModule { }
