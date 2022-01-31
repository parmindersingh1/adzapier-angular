import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangelogComponent } from './changelog.component';
import { ChangelogRoutingModule } from './changelog-routing.module';



@NgModule({
  declarations: [ChangelogComponent],
  imports: [
    CommonModule,
    ChangelogRoutingModule
  ]
})
export class ChangelogModule { }
