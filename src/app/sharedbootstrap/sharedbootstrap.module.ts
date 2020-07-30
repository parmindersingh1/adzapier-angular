import { NgModule } from '@angular/core';
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
// import { AlertModule } from 'ngx-bootstrap/alert';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ModalModule, AlertModule } from 'ngx-bootstrap';


@NgModule({
  declarations: [FilterPipe, TimeAgoPipe],
  imports: [
    CommonModule,
    NgbModule,
    DragDropModule,
    QuillModule.forRoot(),
    NgxPaginationModule,
    FeatherModule.pick(allIcons),
    PaginationModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot()

  ],
  exports: [NgbModule, DragDropModule, QuillModule, NgxPaginationModule, AlertModule, TypeaheadModule, FilterPipe, TimeAgoPipe]

})
export class SharedbootstrapModule { }
