import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebformsComponent } from './webforms.component';
import { AuthGuard } from 'src/app/_helpers';
import { DirtyCheckGuard } from 'src/app/guards/dirty-check.guards';
import { RouteguardService } from 'src/app/_services/routeguard.service';


const routes: Routes = [{path: '', component: WebformsComponent, canActivate: [AuthGuard,RouteguardService], canDeactivate: [DirtyCheckGuard]},
{ path: 'privacy/dsar/dsarform/:id', loadChildren: () => import(`../dsarform/dsarform.module`)
  .then(m => m.DsarformModule), canDeactivate: [DirtyCheckGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebformsRoutingModule { }
