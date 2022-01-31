import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerifyemailComponent } from './verifyemail.component';


const routes: Routes = [{path: '', component: VerifyemailComponent}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyemailRoutingModule { }
