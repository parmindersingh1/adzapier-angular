import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditwebformComponent } from './editwebform.component';
import { EditwebformRoutingModule } from './editwebform-routing.module';



@NgModule({
  declarations: [EditwebformComponent],
  imports: [
    CommonModule,
    EditwebformRoutingModule
  ]
})
export class EditwebformModule { }
