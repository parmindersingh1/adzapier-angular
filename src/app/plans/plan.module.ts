import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PlansComponent} from './plans.component';
import {RouterModule, Routes} from "@angular/router";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


const route: Routes = [
  {path: '', component: PlansComponent}
];

@NgModule({
  declarations: [ PlansComponent ],
  imports: [
    CommonModule,
    BsDropdownModule,
    RouterModule.forChild(route)
  ]
})
export class PlanModule { }
