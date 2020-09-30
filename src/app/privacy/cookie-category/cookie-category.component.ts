import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CookieCategoryService } from '../../_services/cookie-category.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NotificationsService } from 'angular2-notifications';
import { OrganizationService } from '../../_services';
import { ConfirmationService, LazyLoadEvent, SortEvent } from 'primeng/api';
import { MessageService } from 'primeng/api';

interface CategoryResponse {
  response: CategoryResponseData;
  status: number;
}
interface  ColInterface {
  field: string;
  header: string;
}
class SelectItemData {
  id: any;
  name: any;
}
class CategoryResponseData {
  categoryList = [];
  durationtype: [];
}
@Component({
  selector: 'app-cookie-category',
  templateUrl: './cookie-category.component.html',
  styleUrls: ['./cookie-category.component.scss'],
})

export class CookieCategoryComponent implements OnInit {
  categoryModalRef: BsModalRef;
  isScanning = false;
  isDurationType = false;
  catId = '';
  selectedCols: ColInterface[];
  cols: ColInterface[];
  categoryForm: FormGroup;
  categoryFromSubmitted: boolean;
  categoryList;
  durationType;

  productDialog: boolean;

  cookieCategoryList = [];
  totalCookieCount: 0;
  cookieCategory: any;

  selectedProducts = [];
  isUpdate = false;
  // submitted: boolean;
  addCookieForm: FormGroup;
  submitted = false;
  public firstone: number;
  tLoading = true;
  private eventRows: string;
  private pagelimit: string;
  private orderBy: string;
  private data: { limit: any; page: any; sortBy: any, sortColumn: any, search: any };
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  constructor(private service: CookieCategoryService,
    private cd: ChangeDetectorRef,
    private modalService: BsModalService,
    private loading: NgxUiLoaderService,
    private notification: NotificationsService,
    private orgservice: OrganizationService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private messageService: MessageService, private confirmationService: ConfirmationService
  ) {
    this.onInItCategoryForm();
  }
  ngOnInit() {
    this.onGetCategoryAndDurationList();
    this.onSelectedColummFormServer();
    // this.onGetCatList();
    this.onInItCookieForm();
  }
  onSelectedColummFormServer() {
    this.cols = this.onGetColumms();
    const tableCols = localStorage.getItem('cookieCat');
    if (tableCols) {
      const selectedCols = JSON.parse(localStorage.getItem('cookieCat'));
      if (!selectedCols && this.cols) {
        localStorage.setItem('cookieCat', JSON.stringify(this.cols));
      } else {
        this.selectedCols = selectedCols;
      }
      // this.selectedCols = this.cols;
    }
  }
  onGetColumms() {
    return [
      { field: 'party', header: 'Party' },
      { field: 'description', header: 'Description' },
      { field: 'value', header: 'Value' },
      { field: 'expiry', header: 'Expires' },
      { field: 'duration', header: 'Duration' },
    ];
  }
  onInItCookieForm() {
    this.addCookieForm = this.formBuilder.group({
      name: ['', Validators.required],
      path: ['', Validators.required],
      category: ['', Validators.required],
      party: ['', Validators.required],
      description: ['', Validators.required],
      value: ['', Validators.required],
      expiry: [''],
      duration: [''],
      duration_type: [''],
      property: [null],
      http_only: [null],
    });
  }

  onGetCatList(event) {

    this.eventRows = event.rows;
    if (event.first === 0) {
      this.firstone = 1;
    } else {
      this.firstone = (event.first / event.rows) + 1;
    }
    this.pagelimit = '?limit=' + this.eventRows + '&page=' + this.firstone;
    this.data = {
      limit: this.eventRows,
      page: this.firstone,
      sortBy: event.sortOrder === -1 ? 'DESC' : 'ASC',
      sortColumn: event.sortField !== undefined ? event.sortField : '',
      search: event.globalFilter === null ? '' : event.globalFilter
    };
    this.onGetDataFromServer();
  }

  onGetDataFromServer() {
    this.tLoading = true;
    this.service.getCookieData(this.data).subscribe(res => {
      this.tLoading = false;
      this.cookieCategoryList = res['response'];
      this.totalCookieCount = res['count'];
    }, error => {
      this.tLoading = false;
    });
  }

  get f() {
    return this.addCookieForm.controls;
  }

  @Input() get selectedColumns(): any[] {
    if (this.selectedCols) {
      localStorage.setItem('cookieCat', JSON.stringify(this.selectedCols));
    }
    return this.selectedCols;
  }

  set selectedColumns(val: any[]) {
    // restore original order
    this.selectedCols = this.cols.filter(col => val.includes(col));
  }

  onSubmit() {
    const catForm = {
      category: this.addCookieForm.value.category,
      description: this.addCookieForm.value.description,
      duration: Number(this.addCookieForm.value.duration),
      duration_type: this.addCookieForm.value.duration_type,
      expiry: this.addCookieForm.value.expiry,
      name: this.addCookieForm.value.name,
      party: this.addCookieForm.value.party,
      path: this.addCookieForm.value.path,
      value: this.addCookieForm.value.value
    };
    this.submitted = true;
    // stop here if form is invalid
    if (this.addCookieForm.invalid) {
      return;
    }
    if (this.isUpdate) {
      this.onUpdate(catForm);
    } else {
      this.saveProduct(catForm);
    }
  }

  onReset() {
    this.submitted = false;
    this.addCookieForm.reset();
  }



  openNew() {
    this.isUpdate = false;
    this.cookieCategory = {};
    this.submitted = false;
    this.productDialog = true;
  }

  // deleteSelectedProducts() {
  //   this.confirmationService.confirm({
  //     message: 'Are you sure you want to delete the selected products?',
  //     header: 'Confirm',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.cookieCategoryList = this.cookieCategoryList.filter(val => !this.selectedProducts.includes(val));
  //       this.selectedProducts = null;
  //       this.messageService.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
  //     }
  //   });
  // }

  editProduct(product) {
    this.catId = product.id;
    this.isUpdate = true;
    this.addCookieForm.patchValue(product);
    this.cookieCategory = { ...product };
    this.productDialog = true;
  }

  deleteProduct(cookieCat) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + cookieCat.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tLoading = true;
        this.service.delete(cookieCat)
          .subscribe(res => {
            this.tLoading = false;
            this.onGetDataFromServer();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Cookie Deleted', life: 3000 });
          }, error => {
            this.tLoading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
          });
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }
  onUpdate(catForm) {
    this.tLoading = true;
    this.service.put(catForm, this.catId)
      .subscribe(res => {
        this.tLoading = false;
        this.addCookieForm.reset();
        this.cookieCategory = {};
        this.onGetDataFromServer();
        this.productDialog = false;
        // this.onGetCatList();
      }, error => {
        this.tLoading = false;
        this.productDialog = false;
        this.cookieCategory = {};
      });

  }
  saveProduct(catForm) {
    this.tLoading = true;
    this.service.post(catForm)
      .subscribe(res => {
        this.addCookieForm.reset();
        this.tLoading = false;
        this.onGetDataFromServer();
        this.cookieCategory = {};
        this.productDialog = false;
        // this.onGetCatList();
      }, error => {
        this.tLoading = false;
        this.productDialog = false;
        this.cookieCategory = {};
      });

  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.cookieCategoryList.length; i++) {
      if (this.cookieCategoryList[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }


  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order * result);
    });
  }




  //  onInitTable() {
  //   const columns = getColumnsPlayers();
  //   columns.forEach((x, i) => (i > 0) ? x.editable = true : x.editable = false);
  //   columns[1].cellClass = this.getCellClass;
  //   columns[3].options = this.categoryList;
  //   columns[8].options = this.durationType;
  //   this.dataManager = new DataManager(columns, this.settings, this.service, this.messages);
  //   this.dataManager.pager.perPage = 10;
  //   this.cd.detectChanges();
  // }
  //   getCellClass({row, column, value}): any {
  //     return {
  //       'cell-big-value': true
  //       // 'cell-middle-value': parseInt(value, 10) > 1000000 && parseInt(value, 10) < 1000000000,
  //       // 'cell-zero-value': parseInt(value, 10) === 0,
  //       // 'cell-right': true,
  //     };
  //   }
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

  get c() { return this.categoryForm.controls; }

  // @ts-ignore
  async onGetCategoryAndDurationList() {
    const durationType = [];
    const categoryList = [];
    this.loading.start();
    const that = this;
    await this.service.getCategoriesList().then((res: CategoryResponse) => {
      that.loading.stop();
      if (res.status === 200) {
        that.categoryList = res.response.categoryList;
        that.durationType = res.response.durationtype;
      }
      // that.onInitTable();
    }).catch(error => {
      that.loading.stop();
      // this.notification.error('Error', 'Something went wrong', notificationConfig);
      this.isOpen = true;
      this.alertMsg = error;
      this.alertType = 'danger';
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
    this.service.createCategory(categoryData).subscribe(res => {
      this.loading.stop();
      this.categoryModalRef.hide();
      if (res['status'] === 201) {
        // this.notification.info('Category Created', 'The category created successfully', notificationConfig);
        this.isOpen = true;
        this.alertMsg = 'The category created successfully';
        this.alertType = 'success';
      }
    }, error => {
      this.loading.stop();
      this.categoryModalRef.hide();
      // this.notification.error('Error', 'Something went wrong', notificationConfig);
      this.isOpen = true;
      this.alertMsg = error;
      this.alertType = 'danger';
    });
  }
  onRescanCookie() {
    this.isScanning = true;
    this.service.cookieScanning().subscribe(res => {
      this.isScanning = false;
      if (res['status'] === 201) {
        // this.notification.info('Scanning', res['response'], notificationConfig);
        this.isOpen = true;
        this.alertMsg = res['response'];
        this.alertType = 'success';
      }
    }, error => {
      this.isScanning = false;
     // this.notification.error('Error', error, notificationConfig);
      this.isOpen = true;
      this.alertMsg = error;
      this.alertType = 'danger';
    });
  }

onHideModal() {
  this.categoryModalRef.hide();
}
}
