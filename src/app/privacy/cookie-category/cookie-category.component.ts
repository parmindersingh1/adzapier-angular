import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CdtSettings, DataManager, SelectItem, DtMessages, DtMessagesEn} from 'ng-mazdik-lib';
import {CookieCategoryService} from '../../_services/cookie-category.service';
import {getColumnsPlayers} from './columns';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {NotificationsService} from 'angular2-notifications';
import {notificationConfig} from '../../_constant/notification.constant';
import {OrganizationService} from '../../_services';
interface CategoryResponse {
  response: CategoryResponseData;
  status: number;
}
class SelectItemData {
  id: any;
  name: any;
}
class CategoryResponseData {
  categoryList: CategoryResponse[];
  durationtype: [];
}
@Component({
  selector: 'app-cookie-category',
  templateUrl: './cookie-category.component.html',
  styleUrls: ['./cookie-category.component.scss']
})

export class CookieCategoryComponent implements OnInit {
  categoryModalRef: BsModalRef;
  isDurationType = false;
  cookieForm: FormGroup;
  categoryForm: FormGroup;
  categoryFromSubmitted: boolean;
  categoryList;
  durationType;
  dataManager: DataManager;

settings: CdtSettings = new CdtSettings({
  crud: true,
  // bodyHeight: 380,
  exportAction: true,
  globalFilter: false,
  columnToggleAction: true,
  clearAllFiltersAction: true,
  rowClass: this.getCellClass,
  // virtualScroll: true,
});

messages: DtMessages = new DtMessagesEn({
  titleDetailView: 'Cookie details',
  create: 'Create Cookie',
  titleCreate: 'Add Cookie'
});

   constructor(private service: CookieCategoryService,
               private cd: ChangeDetectorRef,
               private modalService: BsModalService,
               private formBuilder: FormBuilder,
               private loading: NgxUiLoaderService,
               private notification: NotificationsService,
               private orgservice: OrganizationService,
               public dialog: MatDialog
) {
   this.onInItCategoryForm();
}
  ngOnInit() {
     this.onGetCategoryAndDurationList();
  }
 onInitTable() {
  const columns = getColumnsPlayers();
  columns.forEach((x, i) => (i > 0) ? x.editable = true : x.editable = false);
  columns[1].cellClass = this.getCellClass;
  columns[3].options = this.categoryList;
  columns[8].options = this.durationType;
  this.dataManager = new DataManager(columns, this.settings, this.service, this.messages);
  this.dataManager.pager.perPage = 10;
  this.cd.detectChanges();
}
  getCellClass({row, column, value}): any {
    return {
      'cell-big-value': true
      // 'cell-middle-value': parseInt(value, 10) > 1000000 && parseInt(value, 10) < 1000000000,
      // 'cell-zero-value': parseInt(value, 10) === 0,
      // 'cell-right': true,
    };
  }
  onInItCategoryForm() {
    const alphaNumeric = '^(?![0-9]*$)[a-zA-Z0-9 ]+$';
    this.categoryForm = this.formBuilder.group({
      categoryName: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      description: ['', [Validators.required]]
    });
  }

  openCategoryModal(template: TemplateRef<any>) {
    this.categoryModalRef = this.modalService.show(template);
  }

  get c() {return this.categoryForm.controls; }

   // @ts-ignore
  async onGetCategoryAndDurationList() {
    const durationType = [];
    const categoryList = [];
    this.loading.start();
    const that = this;
    await this.service.getCategoriesList().then((res: CategoryResponse) => {
    that.loading.stop();
    for (const data of res.response.durationtype) {
      durationType.push({id: data['key'], name: data['value']});
    }
    for (const cat of res.response.categoryList) {
      categoryList.push({id: cat['id'], name: cat['name']});
    }
    that.categoryList = categoryList;
    that.durationType = durationType;
    that.dataManager = null;
    that.isDurationType = true;
    that.onInitTable();
  }).catch( error => {
      that.loading.stop();
      this.notification.error('Error', 'Something went wrong', notificationConfig);
  });
  }

  onCategoryFromSubmit() {
    this.categoryFromSubmitted = true;
    if (this.categoryForm.invalid) {
      return false;
    }
    const categoryData = {
      name: this.categoryForm.value.categoryName,
      description: this.categoryForm.value.description
    };
    this.loading.start();
    this.service.createCategory(categoryData).subscribe( res => {
      this.loading.stop();
      this.categoryModalRef.hide();
      if (res['status'] === 201) {
        this.notification.info('Category Created', 'The category created successfully', notificationConfig);
      }
    }, error => {
      this.loading.stop();
      this.categoryModalRef.hide();
      this.notification.error('Error', 'Something went wrong', notificationConfig);
    });
  }

}
