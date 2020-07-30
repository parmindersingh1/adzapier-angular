import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.scss']

})
export class WorkflowsComponent implements OnInit {
  dismissible = true;
  alertMsg: any;
  workflowList: any;
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
  paginationConfig = { itemsPerPage: this.pgSize, currentPage: this.page, totalItems: this.listTotalCount, id: 'propertyPagination' };
  constructor(private router: Router, private workflowService: WorkflowService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private loadingBar: NgxUiLoaderService,
  ) { }

  ngOnInit() {
    this.loadWorkflowList();
    const alphaNumeric = '^(?![0-9]*$)[a-zA-Z0-9 ]+$';
    this.createWorkFlowForm = this.formBuilder.group({
      workflowName: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      workflowselection: ['', [Validators.required]]
    });
  }
  get addWorkflow() { return this.createWorkFlowForm.controls; }

  createWorkflow() {
    this.router.navigate(['/privacy/dsar/createworkflow']);
  }

  // to retrive all and show only active workflow in dropdown  
  loadWorkflowList() {
    this.workflowService.getWorkflow().subscribe((data) => {
      const key = 'response';
      this.workflowList = data.response;
    });
  }

  public loadWorkflowById(id) {
    // this.loadingBar.start();
    this.workflowService.getWorkflowById(id)
      .subscribe((data: any) => {
        let stages = data.response[0].workflow_stages;
        this.workflowStages = this.rearrangeArrayResponse(stages);
        let x = this.workflowStages.length;
        // this.loadingBar.stop();
      }, (error) => {
        // this.loadingBar.stop();
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
      })
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
      }
      this.workflowService.changeCurrentSelectedWorkflow(requestObj);
      // return false;
      this.workflowService.createWorkflow(requestObj).subscribe((data) => {
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
      })
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
    this.workflowService.getWorkflow(pagelimit).subscribe((data) => {
      this.paginationConfig.totalItems = data.count;
      this.workflowList = data.response;
      //return this.workflowList;
    });
  }

  propertyPageChangeEvent(event) {
  //  this.loadWorkflowListByEvent(event);
    this.paginationConfig.currentPage = event;
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.workflowService.getWorkflow(pagelimit).subscribe((data) => {
      this.paginationConfig.totalItems = data.count;
      this.workflowList = data.response;
     // return this.workflowList;
    });
  }

  navigateToWorkflow(obj) {
    this.workflowService.changeCurrentSelectedWorkflow(obj);
    this.router.navigate(['privacy/dsar/createworkflow/', obj.id]);
  }

  onCancelClick(){
    this.submitted = false;
    this.createWorkFlowForm.reset();
    this.modalService.dismissAll('Canceled');   
  }  

  onClosed(dismissedAlert: any): void {
    this.alertMsg !== dismissedAlert;
    this.isOpen = false;
  }

}
