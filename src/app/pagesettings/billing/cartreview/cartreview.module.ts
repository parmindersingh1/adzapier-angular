import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartreviewComponent } from './cartreview.component';
import {RouterModule, Routes} from '@angular/router';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {FormsModule} from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { AuthGuard } from 'src/app/_helpers';


const routes: Routes = [
  {path: '', component: CartreviewComponent, canActivate: [AuthGuard]},
  ];
@NgModule({
  declarations: [CartreviewComponent],
  imports: [
    CommonModule,
    BsDropdownModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedbootstrapModule
  ]
})
export class CartreviewModule { }
