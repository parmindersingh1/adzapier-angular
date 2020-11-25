import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DsarformComponent } from './dsarform.component';
import { AuthGuard } from 'src/app/_helpers';

const routes: Routes = [
  { path: '', component: DsarformComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DsarformRoutingModule { }
