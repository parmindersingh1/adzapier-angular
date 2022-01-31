import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InviteuserpasswordComponent } from './inviteuserpassword.component';

const routes: Routes = [{path: '', component: InviteuserpasswordComponent}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InviteuserpasswordRoutingModule { }
