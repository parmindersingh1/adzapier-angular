import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { SidemenuComponent} from '../../_components/sidemenu/sidemenu.component'
import { SidemenuRoutingModule } from './sidemenu-routing.module'
@NgModule({
  declarations: [SidemenuComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SidemenuRoutingModule,
    SharedbootstrapModule
  ],
  exports:[SidemenuComponent,SharedbootstrapModule]
})
export class SidemenuModule { }
