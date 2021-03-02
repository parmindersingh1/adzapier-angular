import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebformsComponent } from './webforms.component';
import { AuthGuard } from 'src/app/_helpers';
import { DirtyCheckGuard } from 'src/app/guards/dirty-check.guards';


const routes: Routes = [{path: '', component: WebformsComponent, canActivate: [AuthGuard], canDeactivate: [DirtyCheckGuard]},
{ path: 'privacy/dsar/dsarform/:id', loadChildren: () => import(`../dsarform/dsarform.module`)
  .then(m => m.DsarformModule), canDeactivate: [DirtyCheckGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebformsRoutingModule { }
