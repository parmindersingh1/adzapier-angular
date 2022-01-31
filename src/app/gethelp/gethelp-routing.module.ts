import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GethelpComponent } from './gethelp.component';


const routes: Routes = [{path: '', component: GethelpComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GethelpRoutingModule { }
