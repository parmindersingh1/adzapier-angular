import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ConsentSolutionComponent} from './consent-solution.component';
import {ChartsModule} from 'ng2-charts';

const path: Routes = [
  {path: '', component: ConsentSolutionComponent}
];

@NgModule({
  declarations: [ConsentSolutionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(path),
    ChartsModule
  ]
})
export class ConsentSolutionModule { }
