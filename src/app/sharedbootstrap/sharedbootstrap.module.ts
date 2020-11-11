import {NgModule, Pipe} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { QuillModule } from 'ngx-quill';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FilterPipe } from '../filter.pipe';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { TimeAgoPipe } from 'time-ago-pipe';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AlertModule, TabsModule, AccordionModule} from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SafePipe } from 'src/app/_helpers/safe.pipe';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [FilterPipe, TimeAgoPipe, SafePipe],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DragDropModule,
    NgxSkeletonLoaderModule,
    DragDropModule,
    QuillModule.forRoot(),
    NgxPaginationModule,
    FeatherModule.pick(allIcons),
    PaginationModule.forRoot(),
    AlertModule.forRoot(),
    // ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    // CollapseModule.forRoot(),
    // FeatherModule.pick(allIcons),
    // SimpleNotificationsModule.forRoot(),
    FontAwesomeModule,
    DragDropModule,
  ],
  exports: [NgbModule, NgxSkeletonLoaderModule, DragDropModule, QuillModule, NgxPaginationModule, BsDatepickerModule,
  AlertModule, TypeaheadModule, FilterPipe, TimeAgoPipe, SafePipe]

})
export class SharedbootstrapModule { }
