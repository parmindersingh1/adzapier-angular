import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewChecked, ViewChild } from '@angular/core';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { moduleName } from '../../../_constant/module-name.constant';
import { OrganizationService } from 'src/app/_services';
import { DirtyComponents } from 'src/app/_models/dirtycomponents';
@Component({
  selector: 'app-createworkflow',
  templateUrl: './createworkflow.component.html',
  styleUrls: ['./createworkflow.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush

})
export class CreateworkflowComponent implements OnInit, DirtyComponents {
  dismissible = true;
  isOpen = false;
  workflowList: any;
  viewMode: any;
  workflowName: any;
  workflowselection: any;
  workflowStagesFromId: any;
  selectedWorkflowId: any;
  workflowStatus: any;
  workflowStages: any = [];
  stageTitle: any;
  guidancetext: any = '';
  order: any;
  currentStage: any;
  editorGuidanceText: string;
  selectedTab: any;
  isTabSelected: boolean;
  isWorkflowEditing: boolean;
  submitted = true;
  isControlDisabled = false;
  isWorkflownameEdit = false;
  alertMsg: any;
  alertType: any;
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: 1 }, { header: 2 }],
        ['link'],
        [{ align: [] }],
        [{ size: ['small', false, 'large', 'huge'] }]
      ]
    }
  };
  workflowType: string;
  isworkflowSaved = false;
  skeletonLoading = true;
  selectedStageId: any;
  selectedIndex: number;
  currentManagedOrgID: any;
  defaultStages:any[];
  isDirty: boolean;
  constructor(private activatedRoute: ActivatedRoute,
              private workflowService: WorkflowService,
              private loadingBar: NgxUiLoaderService,
              private orgservice: OrganizationService,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.onGetOrgId();
    this.isWorkflowEditing = false;
    this.loadWorkflowList();

    this.activatedRoute.paramMap.subscribe(params => {
      this.selectedWorkflowId = params.get('id');
    });

    this.workflowService.selectedWorkflow.subscribe((data) => {
      this.workflowName = data.workflow_name;
    }, (error) => {
      this.isOpen = true;
      this.alertMsg = error;
      this.alertType = 'danger';
    });


    this.loadWorkflowById(this.selectedWorkflowId);
    this.defaultStages = ['UNVERIFIED','NEW','VERIFY REQUEST','VERIFY CONSUMER REQUEST','LEGAL/PRIVACY REVIEW','REQUEST FULFILL','CONSUMER NOTIFICATION','IN PROGRESS','COMPLETE','NOTIFY'];
  }

  previousTab() {
    if (this.viewMode == 'tab3') {
      this.viewMode = 'tab2';
    } else if (this.viewMode == 'tab2') {
      this.viewMode = 'tab1';
    }
  }

  onGetOrgId() {
    this.orgservice.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.currentManagedOrgID = response.organization_id;
      } else {
        const orgDetails = this.orgservice.getCurrentOrgWithProperty();
        this.currentManagedOrgID = orgDetails.organization_id;
      }
    });
  }

  loadWorkflowList() {
    this.loadingBar.start();
    this.workflowService.getWorkflow(this.constructor.name, moduleName.workFlowModule, this.currentManagedOrgID).subscribe((data) => {
      this.workflowList = data.response;
      this.loadingBar.stop();
    });
  }

  onWorkflowChange($event) {
    this.loadWorkflowById($event.target.value);
  }

  clickOnWorkflowStages($event) {
    if($event.id == ''){
      this.isDirty = true;
    }
    this.selectedTab = $event;
    this.selectedStageId = $event.id;
    this.isTabSelected = true;
    this.stageTitle = $event.stage_title;
    this.guidancetext = $event.guidance_text;
    this.order = $event.order;
    this.isDefaultWorkflowStage();
  }

  update(e) {
    if (this.selectedTab !== undefined) {
      const index = this.workflowStages.findIndex((t) => t.order === this.selectedTab.order);
      this.workflowStages[index].stage_title = e.currentTarget.value;
      this.stageTitle = e.currentTarget.value;
      this.isDirty = true;
    } else {
      this.workflowStages[0].stage_title = e.currentTarget.value;
      this.stageTitle = e.currentTarget.value;
    }

  }

  updateGuidanceText(e) {
    const index = this.workflowStages.findIndex((t) => t.id === this.selectedStageId);
    this.guidancetext = e.html;
    this.workflowStages[index].guidance_text = this.guidancetext;
  }

  rearrangeArrayResponse(dataArray) {
    dataArray.sort((a, b) => {
      return a.order - b.order;
    });
    return dataArray;
  }

  onClickWorflowTab(viewTab) {
    if (viewTab == 'tab1') {
      this.viewMode = viewTab;
    }
    if (viewTab == 'tab2') {
      if (this.workflowStages.length !== 0) {
        this.viewMode = viewTab;
      } else {
        return false;
      }
    }
    if (viewTab == 'tab3') {
      if (this.workflowStages.length !== 0) {
        this.viewMode = viewTab;
      } else {
        return false;
      }
    }
  }

  activateWorkflowById(id) {
    const reqObj = {
      workflow_status: 'Active',
      oid: this.currentManagedOrgID
    };
    this.workflowService.updateWorkflow(this.constructor.name, moduleName.workFlowModule, id, reqObj).subscribe((data) => {
      if (data) {
        this.alertMsg = data.response;
        this.isOpen = true;
        this.alertType = 'success';
        this.loadWorkflowList();
      }
    }, (error) => {
      console.log(JSON.stringify(error));
      this.isOpen = true;
      this.alertMsg = error;
      this.alertType = 'danger';
    });
  }

  saveWorkflow(quillEditorForm: NgForm, status) {
    this.submitted = true;
    //this.isWorkflownameEdit = this.isWorkflownameEdit;
    const flowStatus = status === 'active' ? 'draft' : 'active';
    if (quillEditorForm.invalid) {
      this.skeletonLoading = false;
      return false;
    } else {
      const requestObj = {
        workflow_name: this.workflowName,
        workflow_stages: this.workflowStages,
        workflow_status: status,
        oid: this.currentManagedOrgID
      };
      this.skeletonLoading = true;
      this.workflowService.updateWorkflow(this.constructor.name, moduleName.workFlowModule, this.selectedWorkflowId, requestObj)
        .subscribe((data) => {
          if (data) {
            this.isWorkflownameEdit = false;
            this.isworkflowSaved = true;
            this.isControlDisabled = false;
            this.alertMsg = data.response;
            this.isOpen = true;
            this.alertType = 'success';
            this.skeletonLoading = false;
            this.isDirty = false;
            this.loadWorkflowById(this.selectedWorkflowId);
          }
        }, (error) => {
          if(error == "Bad Request"){
            this.alertMsg = "No Default stages are can not be edited";
            this.isOpen = true;
            this.alertType = 'danger';
            this.skeletonLoading = false;
            this.loadWorkflowById(this.selectedWorkflowId);
          }else{
            this.alertMsg = error;
            this.isOpen = true;
            this.alertType = 'danger';
            this.skeletonLoading = false;
            this.loadWorkflowById(this.selectedWorkflowId);
          }
        });
    }

  }

  editWorkflow($event, status) {
    const flowStatus = status === 'active' ? 'draft' : 'active';
    if ($event.target.innerText === 'Activate' && !this.isControlDisabled) {
      this.activateWorkflow(status);
      this.isControlDisabled = false;
    } else {
      this.workflowStatus = flowStatus;
    }
  }

  activateWorkflow(status) {
    const flowStatus = status === 'draft' ? 'active' : 'draft';

    if (flowStatus === 'draft') {
      this.isControlDisabled = false;
    }
    const reqObj = {
      workflow_status: flowStatus,
      oid: this.currentManagedOrgID
    };
    this.workflowService.updateWorkflow(this.constructor.name, moduleName.workFlowModule, this.selectedWorkflowId, reqObj)
      .subscribe((data) => {
        if (data) {
          this.alertMsg = data.response;
          this.isOpen = true;
          this.alertType = 'success';
          this.loadWorkflowById(this.selectedWorkflowId);
        }
      }, (error) => {
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
        console.log(JSON.stringify(error));
      });
  }

  checkFormStatus(): boolean {
    if (this.isControlDisabled && this.workflowStatus === 'active') {
      return this.isControlDisabled = false;
    }
  }

  // checkButtonStatus(): boolean {
  //   if (this.workflowType === 'custom') {
  //     return false;
  //   } else if (this.workflowStatus === 'active' || this.isControlDisabled) {
  //     return true;
  //   } else if (this.workflowStatus === 'draft' && !this.isControlDisabled) {
  //     return false;
  //   } else if (this.workflowStatus === 'draft' && this.isControlDisabled) {
  //     return true;
  //   } else if (this.workflowType === 'default' || this.workflowStatus === 'active' && this.isControlDisabled) {
  //     return true;
  //   } else if (this.workflowType === 'custom' || this.workflowStatus === 'draft' && !this.isControlDisabled) {
  //     return true;
  //   }
  // }

  loadWorkflowById(id?) {
    this.skeletonLoading = true;
    let resp: any;
    this.workflowService.getWorkflowById(this.constructor.name, moduleName.workFlowModule, this.currentManagedOrgID, id)
      .subscribe((data) => {
        if (data.length > 0) {
          resp = this.rearrangeArrayResponse(data[0].workflow_stages);
          this.workflowStages = resp;
          this.selectedStageId = this.selectedStageId || this.workflowStages[0].id;
          const stageIndex = this.workflowStages.findIndex((t) => t.id === this.selectedStageId);
          stageIndex == 0 ? this.isControlDisabled = true : this.isControlDisabled = false;
          const stageTitle = this.workflowStages[stageIndex].stage_title;
          const guidanceText = this.workflowStages[stageIndex].guidance_text;
          this.order = this.workflowStages[stageIndex].order;
          this.workflowStatus = data[0].workflow_status;
          this.workflowType = data[0].workflow_type;
          // if (this.workflowStatus === 'active') {
          //   this.isControlDisabled = true;
          // } else {
          //   this.isControlDisabled = false;
          // }
          this.workflowName = data[0].workflow_name;
          this.stageTitle = stageTitle;
          this.guidancetext = guidanceText;
          this.skeletonLoading = false;
        } else {
          this.skeletonLoading = false;
          this.alertMsg = 'No data found!';
          this.isOpen = true;
          this.alertType = 'info';
        }
      }, (error) => {
        this.skeletonLoading = false;
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
      });
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  isEditorDisabled(): object {
    if (this.isControlDisabled || this.workflowStatus == 'active') {
      return {
        'background-color': '#f5f6fa',
        'cursor': 'not-allowed'
    };
  } else {
  return {
    'background-color': '#ffffff'
    };
     }
  }

  isDefaultWorkflowStage():boolean{
    this.isControlDisabled = this.defaultStages.some((t) => t == this.stageTitle);
    return this.isControlDisabled;
  }

  canDeactivate() {
    return this.isDirty;
  }

  deleteCustomStages($event){
    if($event.id !== undefined){
      this.workflowService.deleteWorkflowStage(this.constructor.name, moduleName.workFlowModule,$event.id,this.selectedWorkflowId).subscribe((data)=>{
        this.alertMsg = data.response;
        this.isOpen = true;
        this.alertType = 'info';
      },(error)=>{
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
      })
    }
  
  }

}
