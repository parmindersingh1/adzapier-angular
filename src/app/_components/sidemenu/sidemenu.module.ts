import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { SidemenuComponent} from '../../_components/sidemenu/sidemenu.component'
@NgModule({
  declarations: [SidemenuComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedbootstrapModule
  ],
  exports:[SidemenuComponent,SharedbootstrapModule]
})
export class SidemenuModule { }
