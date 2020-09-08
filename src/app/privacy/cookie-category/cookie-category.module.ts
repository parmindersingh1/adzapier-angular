import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {CookieCategoryComponent} from "./cookie-category.component";
import {AuthGuard} from "../../_helpers";
import { ModalModule } from 'ngx-bootstrap/modal';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ReactiveFormsModule} from "@angular/forms";
import {CrudTableModule, NotifyModule} from "ng-mazdik-lib";
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';

const route: Routes = [
  {path: '', component: CookieCategoryComponent, canActivate: [AuthGuard]}
];
@NgModule({
  declarations: [CookieCategoryComponent],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    RouterModule.forChild(route),
    MatDialogModule,
    NotifyModule,
    ReactiveFormsModule,
    CrudTableModule,
    SharedbootstrapModule
  ],
})
export class CookieCategoryModule { }
