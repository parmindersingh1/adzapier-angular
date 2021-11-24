import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartsystemComponent } from './cartsystem.component';
import {RouterModule, Routes} from '@angular/router';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {FormsModule} from '@angular/forms';
import { QuickstartalertModule } from 'src/app/_components/quickstartalert/quickstartalert.module';

const routes: Routes = [
  {path: '', component: CartsystemComponent, },
  ];

@NgModule({
  declarations: [CartsystemComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedbootstrapModule,
    BsDropdownModule,
    FormsModule,
    QuickstartalertModule
  ]
})
export class CartsystemModule { }
