import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CookieBannerComponent} from './cookie-banner.component';
import {RouterModule, Routes} from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {ReactiveFormsModule} from '@angular/forms';


const path: Routes = [{
  path: '', component: CookieBannerComponent
}];
@NgModule({
  declarations: [CookieBannerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(path),
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class CookieBannerModule { }
