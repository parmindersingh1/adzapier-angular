import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DsarRequestdetailsComponent } from './dsar-requestdetails.component';
import { AuthGuard } from 'src/app/_helpers';


const routes: Routes = [{path: '', component: DsarRequestdetailsComponent, canActivate: [AuthGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DsarRequestdetailsRoutingModule { }
