import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewChecked, ViewChild } from '@angular/core';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { moduleName } from '../../../_constant/module-name.constant';
@Component({
  selector: 'app-createworkflow',
  templateUrl: './createworkflow.component.html',
  styleUrls: ['./createworkflow.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush

})
export class CreateworkflowComponent implements OnInit {
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
  stage_title: any;
  order: any;
  currentStage: any;
  editorGuidanceText: string;
  quillEditorGuidanceText: FormGroup;
  selectedTab: any;
  isTabSelected: boolean;
  isWorkflowEditing: boolean;
  submitted = true;
  isControlDisabled = false;
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
  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private workflowService: WorkflowService,
              private loadingBar: NgxUiLoaderService,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.isWorkflowEditing = false;
    this.loadWorkflowList();
    this.quillEditorGuidanceText = this.fb.group({
      guidancetext: ['', [Validators.required]],
      stage_title: ['', [Validators.required]]
    });

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


    this.loadWorkflowById();

  }
  get cwf() { return this.quillEditorGuidanceText.controls; }

  previousTab() {
    if (this.viewMode == 'tab3') {
      this.viewMode = 'tab2';
    } else if (this.viewMode == 'tab2') {
      this.viewMode = 'tab1';
    }
  }

  loadWorkflowList() {
    this.loadingBar.start();
    this.workflowService.getWorkflow(this.constructor.name, moduleName.workFlowModule).subscribe((data) => {
      this.workflowList = data.response;
      this.loadingBar.stop();
    });
  }

  onWorkflowChange($event) {
    console.log($event, '$event.');
    this.loadWorkflowById($event.target.value);
  }

  clickOnWorkflowStages($event) {
    this.selectedTab = $event;
    this.isTabSelected = true;
    this.quillEditorGuidanceText.controls['guidancetext'].setValue($event.guidance_text);
    this.quillEditorGuidanceText.controls['stage_title'].setValue($event.stage_title);
  }

  update(e) {
    if (this.selectedTab !== undefined) {
      let index = this.workflowStages.findIndex((t) => t.order === this.selectedTab.order);
      this.workflowStages[index].stage_title = e.currentTarget.value;
      this.quillEditorGuidanceText.controls['stage_title'].setValue(e.currentTarget.value);
    } else {
      this.workflowStages[0].stage_title = e.currentTarget.value;
      this.quillEditorGuidanceText.controls['stage_title'].setValue(e.currentTarget.value);
    }

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
      workflow_status: 'Active'
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

  saveWorkflow(status) {
    this.submitted = true;
    const flowStatus = status === 'active' ? 'draft' : 'active';
    if (this.quillEditorGuidanceText.invalid) {
      return;
    } else {
      const requestObj = {
        workflow_name: this.workflowName,
        workflow_stages: this.workflowStages,
        workflow_status: flowStatus
      };
      this.loadingBar.start();
      this.workflowService.updateWorkflow(this.constructor.name, moduleName.workFlowModule, this.selectedWorkflowId, requestObj)
        .subscribe((data) => {
          if (data) {
            this.isworkflowSaved = true;
            this.isControlDisabled = true;
            this.quillEditorGuidanceText.controls['guidancetext'].disable();
            this.alertMsg = data.response;
            this.isOpen = true;
            this.alertType = 'success';
            this.loadWorkflowById(this.selectedWorkflowId);
            this.loadingBar.stop();
          }
        }, (error) => {
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
          this.loadingBar.stop();
        });
    }

  }

  editWorkflow($event, status) {
    console.log($event.target.value, 'ev..');
    if ($event.target.innerText === 'Activate' && !this.isControlDisabled) { //  
      this.activateWorkflow(status);
    } else {
      this.isControlDisabled = false;
      this.quillEditorGuidanceText.controls['guidancetext'].enable();
      this.quillEditorGuidanceText.controls['stage_title'].enable();
    }
  }

  activateWorkflow(status) {
    const flowStatus = status === 'active' ? 'draft' : 'active';

    if (flowStatus === 'draft') {
      this.quillEditorGuidanceText.controls['guidancetext'].enable();
      this.quillEditorGuidanceText.controls['stage_title'].enable();
      this.isControlDisabled = false;
    }
    const reqObj = {
      workflow_status: flowStatus
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
      this.quillEditorGuidanceText.controls['guidancetext'].enable();
      this.quillEditorGuidanceText.controls['stage_title'].enable();
      return this.isControlDisabled = false;
    }
  }

  checkButtonStatus(): boolean {
    if (this.workflowType === 'custom' || this.workflowStatus === 'active' && this.isControlDisabled) {
      return false;
    } else if (this.workflowType === 'default' || this.workflowStatus === 'active' && this.isControlDisabled) {
      return true;
    } else if (this.workflowType === 'custom' || this.workflowStatus === 'draft' && !this.isControlDisabled) {
      return true;
    }
  }

  loadWorkflowById(id?) {
    this.loadingBar.start();
    let resp: any;
    this.workflowService.getWorkflowById(this.constructor.name, moduleName.workFlowModule, this.selectedWorkflowId)
      .subscribe((data) => {
        if (data.length > 0) {
          resp = this.rearrangeArrayResponse(data[0].workflow_stages);
          this.workflowStages = resp;
          let stage_title = this.workflowStages[0].stage_title;
          let guidance_text = this.workflowStages[0].guidance_text;
          this.workflowStatus = data[0].workflow_status;
          this.workflowType = data[0].workflow_type;
          if (this.workflowStatus === 'active') {
            this.quillEditorGuidanceText.controls['guidancetext'].disable();
            this.quillEditorGuidanceText.controls['stage_title'].disable();
            this.isControlDisabled = true;
          }
          this.workflowName = data[0].workflow_name;
          this.quillEditorGuidanceText.controls['guidancetext'].setValue(guidance_text);
          this.quillEditorGuidanceText.controls['stage_title'].setValue(stage_title);
          this.loadingBar.stop();
          //  this.workflowStages;
        } else {
          this.alertMsg = 'No data found!';
          this.isOpen = true;
          this.alertType = 'info';
        }
      }, (error) => {
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
      });
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

}
