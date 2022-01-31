import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditProfileComponent } from './edit-profile.component';
import { AuthGuard } from '../_helpers';


const routes: Routes = [
  {
    path: '', component: EditProfileComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditProfileRoutingModule { }
