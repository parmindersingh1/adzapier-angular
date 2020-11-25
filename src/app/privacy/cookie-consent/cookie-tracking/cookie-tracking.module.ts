import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieTrackingComponent} from './cookie-tracking.component';
import {ButtonModule} from 'primeng/button';
import { RatingModule} from 'primeng/rating';
import { TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

const route: Routes = [
  {path: '', component: CookieTrackingComponent}
];

@NgModule({
  declarations: [
    CookieTrackingComponent
  ],
  imports: [
    CommonModule,
    RatingModule,
    FormsModule,
    ButtonModule,
    TableModule,
    RouterModule.forChild(route)
  ]
})
export class CookieTrackingModule { }
