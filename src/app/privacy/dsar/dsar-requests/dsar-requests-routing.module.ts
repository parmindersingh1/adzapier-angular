import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DsarRequestsComponent } from './dsar-requests.component';
import { AuthGuard } from 'src/app/_helpers';

const routes: Routes = [
  { path: '', component: DsarRequestsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DsarRequestsRoutingModule { }
