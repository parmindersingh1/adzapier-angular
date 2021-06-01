import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignoutPageComponent } from './signout-page.component';

const routes: Routes = [{ path: '', component: SignoutPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignoutPageRoutingModule { }
