import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TwostepregisterComponent } from './twostepregister.component';

const routes: Routes = [{ path: '', component: TwostepregisterComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TwostepregisterRoutingModule { }
