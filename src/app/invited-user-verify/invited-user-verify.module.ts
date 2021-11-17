import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InvitedUserVerifyComponent} from './invited-user-verify.component';
import {RouterModule, Routes} from '@angular/router';

const router: Routes = [
  {path: '', component: InvitedUserVerifyComponent}
];

@NgModule({
  declarations: [InvitedUserVerifyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(router)
  ]
})
export class InvitedUserVerifyModule { }
