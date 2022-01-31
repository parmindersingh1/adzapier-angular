import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DecodeComponent } from './decode.component';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';

const path: Routes = [
  {path: '', component: DecodeComponent}
]

@NgModule({
  declarations: [DecodeComponent],
  imports: [
    CommonModule,
    SharedbootstrapModule,
    RouterModule.forChild(path)
  ]
})
export class DecodeModule { }
