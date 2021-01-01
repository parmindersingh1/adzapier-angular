import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ManageSubscriptionComponent} from './manage-subscription.component';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';


const paths: Routes = [
  {path: '', component: ManageSubscriptionComponent}
];
@NgModule({
  declarations: [ManageSubscriptionComponent],
  imports: [
    CommonModule,
    SharedbootstrapModule,
    RouterModule.forChild(paths)
  ]
})
export class ManageSubscriptionModule { }
