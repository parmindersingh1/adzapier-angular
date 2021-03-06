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

import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AlertModule} from 'ngx-bootstrap/alert';
import { TabsModule} from 'ngx-bootstrap/tabs';
import { AccordionModule} from 'ngx-bootstrap/accordion';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SafePipe } from 'src/app/_helpers/safe.pipe';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
// import { TimeagoModule } from 'ngx-timeago';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import {TimeagoModule} from 'ngx-timeago';

@NgModule({
  declarations: [FilterPipe, SafePipe],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DragDropModule,
    NgxSkeletonLoaderModule.forRoot(),
    DragDropModule,
    QuillModule.forRoot(),
    NgxPaginationModule,
    FeatherModule.pick(allIcons),
    PaginationModule.forRoot(),
    AlertModule.forRoot(),
    TimeagoModule,
  //  TimeagoModule.forRoot({formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter }}),
    // ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    TimeagoModule.forRoot(),
    // FeatherModule.pick(allIcons),
    // SimpleNotificationsModule.forRoot(),
    FontAwesomeModule,
    DragDropModule,

  ],


  exports: [CommonModule, NgbModule, CollapseModule, BsDropdownModule, NgxSkeletonLoaderModule, DragDropModule, QuillModule, FeatherModule,
     NgxPaginationModule, BsDatepickerModule, TooltipModule, AlertModule, TypeaheadModule, AccordionModule, FilterPipe,
    TimeagoModule,  SafePipe],
  providers: [ ]

})
export class SharedbootstrapModule { }
