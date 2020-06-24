import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditwebformComponent } from './editwebform.component';
import { AuthGuard } from '../_helpers';


const routes: Routes = [{path: '', component: EditwebformComponent, canActivate: [AuthGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditwebformRoutingModule { }
