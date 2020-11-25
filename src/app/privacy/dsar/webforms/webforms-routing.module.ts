import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebformsComponent } from './webforms.component';
import { AuthGuard } from 'src/app/_helpers';


const routes: Routes = [{path: '', component: WebformsComponent, canActivate: [AuthGuard]},
{ path: 'privacy/dsar/dsarform/:id', loadChildren: () => import(`../dsarform/dsarform.module`)
  .then(m => m.DsarformModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebformsRoutingModule { }
