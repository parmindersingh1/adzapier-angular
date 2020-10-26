import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TablePaginationConfig } from 'src/app/_models/tablepaginationconfig';
import { moduleName } from '../../../_constant/module-name.constant';
import { LazyLoadEvent } from 'primeng/api';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.scss']
})

export class WorkflowsComponent implements OnInit, AfterViewInit  {
  dismissible = true;
  alertMsg: any;
  workflowList: any = [];
  activeWorkflowList: any;
  isOpen = false;
  alertType: any;
  createWorkFlowForm: FormGroup;
  submitted: boolean;
  // workflowName: any;
  workflowselection: any;
  workflowStages: any = [];
  selectedWorkflowId: any;
  searchText: any;
  page: number = 1;
  pgSize: any = 5;
  listTotalCount: any;
  paginationConfig: TablePaginationConfig;
  isloading: boolean;
  cols: any[];
  selectedCols: any[];
  eventRows: number;
  firstone = 0;
  first = 0;
  rows = 0;
  totalRecords: number;
  public inputValue = '';
  public debouncedInputValue = this.inputValue;
  private searchDecouncer$: Subject<string> = new Subject();
  
  constructor(private router: Router, private workflowService: WorkflowService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private loading: NgxUiLoaderService,
              private cdRef: ChangeDetectorRef
  ) {
    this.paginationConfig = { itemsPerPage: this.pgSize, currentPage: this.page, totalItems: this.listTotalCount, id: 'propertyPagination' };
  }

  ngOnInit() {
    this.loadWorkflowList();
    this.loadActiveWorkflowList();
    this.setupSearchDebouncer();
    const alphaNumeric = '^(?![0-9]*$)[a-zA-Z0-9 ]+$';
    this.createWorkFlowForm = this.formBuilder.group({
      workflowName: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      workflowselection: ['', [Validators.required]]
    });
    this.isloading = true;
  }
  get addWorkflow() { return this.createWorkFlowForm.controls; }

  createWorkflow() {
    this.router.navigate(['/privacy/dsar/createworkflow']);
  }

  // to retrive all and show only active workflow in dropdown  
  loadWorkflowList() {
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.workflowService.getWorkflow(this.constructor.name, moduleName.workFlowModule, pagelimit).subscribe((data) => {
      this.workflowList = data.response;
      this.paginationConfig.totalItems = data.count;
    });
  }

  @Input() get selectedColumns(): any[] {
    return this.selectedCols;
  }

  set selectedColumns(val: any[]) {
    // restore original order
    this.selectedCols = this.cols.filter(col => val.includes(col));
  }
  
  loadrequestsListLazy(event: LazyLoadEvent) {
    this.isloading = true;
    this.eventRows = event.rows;
    if (this.workflowList) {

      if (event.first === 0) {
        this.firstone = 1;
      } else {
        this.firstone = (event.first / event.rows) + 1;
      }
      const pagelimit = '?limit=' + this.eventRows + '&page=' + this.firstone;
      const sortOrder = event.sortOrder === -1 ? 'DESC' : 'ASC';
      const orderBy = '&orderby=' + event.sortField + ' ' + sortOrder;

      this.workflowService.getWorkflow(this.constructor.name, moduleName.workFlowModule, pagelimit).subscribe((data) => {
        this.isloading = false;
        this.workflowList = data.response;
        this.rows = data.response.length;
        this.totalRecords = data.count;
      }, error => {
        this.loading.stop();
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
      });

      
    }

    this.cols = [
      { field: 'workflow_name', header: 'Workflow Name' },
      { field: 'workflow_status', header: 'Status' },
      { field: 'createdby_firstname', header: 'Created by' },
      { field: 'createdby_lastname', header: 'Created by' },
      { field: 'updatedby_firstname', header: 'Updated by' },
      { field: 'updatedby_lastname', header: 'Updated by' },
      { field: 'created_at', header: 'Created date' },
      { field: 'updated_at', header: 'Last updated date' }
    ];

    this.selectedCols = this.cols;
  }
 

loadActiveWorkflowList() {
  const pagelimit = '?limit=' + 0;
  this.workflowService.getActiveWorkflowList(this.constructor.name, moduleName.workFlowModule).subscribe((data) => {
    this.activeWorkflowList = data.response;
    this.paginationConfig.totalItems = data.count;
  });
}


  public loadWorkflowById(id) {
  // this.loadingBar.start();
  this.workflowService.getWorkflowById(this.constructor.name, moduleName.workFlowModule, id)
    .subscribe((data: any) => {
      const stages = data[0].workflow_stages;
      this.workflowStages = this.rearrangeArrayResponse(stages);
      let x = this.workflowStages.length;
      // this.loadingBar.stop();
    }, (error) => {
      // this.loadingBar.stop();
      this.isOpen = true;
      this.alertMsg = error;
      this.alertType = 'danger';
    });
}


createWorkflowModalPopup(content, data) {
  if (data !== '') {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

    }, (reason) => {

    });
  } else {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

    }, (reason) => {

    });
  }

}



public onSearchInputChange(): void {
  this.searchDecouncer$.next(this.inputValue);
}

public clearSearchfield() {
  this.inputValue = '';
  this.searchDecouncer$.next(this.inputValue);
}

private setupSearchDebouncer(): void {
  this.searchDecouncer$.pipe(
    debounceTime(1000),
    distinctUntilChanged(),
  ).subscribe((term: string) => {
    this.debouncedInputValue = term;
    this.searchFilter();
  });
}

private searchFilter(): void {
  const params = '?limit=' + this.eventRows + '&page=' + this.firstone
    + '&search=' + this.inputValue;
  this.isloading = true;
  this.workflowService.getWorkflow(this.constructor.name, moduleName.workFlowModule, params).subscribe((data) => {
    this.isloading = false;
    this.workflowList = data.response;
    this.rows = data.response.length;
    this.totalRecords = data.count;
  }, error => {
    this.loading.stop();
    this.alertMsg = error;
    this.isOpen = true;
    this.alertType = 'danger';
  });
}

onWorkflowChange($event) {
  console.log($event, '$event.');
  this.selectedWorkflowId = $event.target.value;
  this.loadWorkflowById($event.target.value);
}


createWorkFlow() {
  this.submitted = true;
  if (this.createWorkFlowForm.invalid) {
    return false;
  } else {
    const requestObj = {
      workflow_name: this.createWorkFlowForm.value.workflowName,
      workflow_stages: this.workflowStages,
      workflow_status: 'draft'
    };
    this.workflowService.changeCurrentSelectedWorkflow(requestObj);
    // return false;
    this.workflowService.createWorkflow(this.constructor.name, moduleName.workFlowModule, requestObj).subscribe((data) => {
      if (data) {
        this.alertMsg = data.response;
        this.isOpen = true;
        this.alertType = 'success';
        this.createWorkFlowForm.reset();
        this.modalService.dismissAll('Data Saved!');
        this.router.navigate(['privacy/dsar/createworkflow', data.id]);
        this.loadWorkflowList();
      }
    }, (error) => {
      this.isOpen = true;
      this.alertMsg = error;
      this.alertType = 'danger';
      this.createWorkFlowForm.reset();
      this.modalService.dismissAll('error!');
    });
  }
}

rearrangeArrayResponse(dataArray) {
  dataArray.sort((a, b) => {
    return a.order - b.order;
  });
  return dataArray;
}

onPagesizeChangeEvent(event) {
  this.paginationConfig.itemsPerPage = Number(event.target.value);
  const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
  this.workflowService.getWorkflow(this.constructor.name, moduleName.workFlowModule, pagelimit).subscribe((data) => {
    this.paginationConfig.totalItems = data.count;
    this.workflowList = data.response;
  });
}

propertyPageChangeEvent(event) {
  //  this.loadWorkflowListByEvent(event);
  this.paginationConfig.currentPage = event;
  const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
  this.workflowService.getWorkflow(this.constructor.name, moduleName.workFlowModule, pagelimit).subscribe((data) => {
    this.paginationConfig.totalItems = data.count;
    this.workflowList = data.response;
    // return this.workflowList;
  });
}

navigateToWorkflow(obj) {
  this.workflowService.changeCurrentSelectedWorkflow(obj);
  this.router.navigate(['privacy/dsar/createworkflow/', obj.id]);
}

onCancelClick() {
  this.submitted = false;
  this.createWorkFlowForm.reset();
  this.modalService.dismissAll('Canceled');
}

onClosed(dismissedAlert: any): void {
  this.alertMsg = !dismissedAlert;
  this.isOpen = false;
}

ngAfterViewInit() {
  this.cols = [
    { field: 'workflow_name', header: 'Workflow Name' },
    { field: 'workflow_status', header: 'Status' },
    { field: 'createdby_firstname', header: 'Created by' },
    { field: 'createdby_lastname', header: 'Created by' },
    { field: 'updatedby_firstname', header: 'Updated by' },
    { field: 'updatedby_lastname', header: 'Updated by' },
    { field: 'created_at', header: 'Created date' },
    { field: 'updated_at', header: 'Last updated date' }
  ];

  this.selectedCols = this.cols;
  this.cdRef.detectChanges();
}

}
