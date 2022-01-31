import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GDPRComponent } from './gdpr.component';


const routes: Routes = [{path: '', component: GDPRComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GdprRoutingModule { }
