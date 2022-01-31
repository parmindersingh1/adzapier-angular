import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SidemenuComponent } from './sidemenu.component';

const routes: Routes = [{path: '', component: SidemenuComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SidemenuRoutingModule { }

