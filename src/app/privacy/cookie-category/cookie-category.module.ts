import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {CookieCategoryComponent} from "./cookie-category.component";
import {AuthGuard} from "../../_helpers";
import { ModalModule } from 'ngx-bootstrap/modal';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CrudTableModule, NotifyModule} from "ng-mazdik-lib";
import { SharedbootstrapModule } from 'src/app/sharedbootstrap/sharedbootstrap.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import {ConfirmationService, MessageService} from 'primeng/api';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from 'primeng/ripple';
import {MultiSelectModule} from 'primeng/multiselect';

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
    SharedbootstrapModule,
    ConfirmDialogModule,
    FormsModule,
    InputNumberModule,
    RadioButtonModule,
    DialogModule,
    RatingModule,
    TableModule,
    ToolbarModule,
    ToastModule,
    FileUploadModule,
    InputTextModule,
    RippleModule,
    MultiSelectModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class CookieCategoryModule { }
