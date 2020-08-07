import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CookieBannerComponent} from './cookie-banner.component';
import {RouterModule, Routes} from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';


const path: Routes = [{
  path: '', component: CookieBannerComponent
}];
@NgModule({
  declarations: [CookieBannerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(path),
    MatSelectModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatInputModule,
    MatButtonModule,
    MatButtonModule,
    MatExpansionModule
  ]
})
export class CookieBannerModule { }
