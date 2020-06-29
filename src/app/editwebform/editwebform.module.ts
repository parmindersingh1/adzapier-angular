import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditwebformComponent } from './editwebform.component';
import { EditwebformRoutingModule } from './editwebform-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [EditwebformComponent],
  imports: [
    CommonModule,
    EditwebformRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class EditwebformModule { }
