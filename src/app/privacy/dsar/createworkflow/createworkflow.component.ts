import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-createworkflow',
  templateUrl: './createworkflow.component.html',
  styleUrls: ['./createworkflow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class CreateworkflowComponent implements OnInit {
  workflowList: any;
  viewMode: any;
  workflowName: any;
  workflowselection: any;
  workflowStagesFromId: any;
  workflowStages: any = [];
  tabList: any = [];
  stage_title: any;
  order: any;
  currentStage: any;
  editorGuidanceText: string;
  quillEditorGuidanceText: FormGroup;
  selectedTab: any;
  isTabSelected: boolean;
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
  constructor(private fb: FormBuilder, private workflowService: WorkflowService) {
    this.loadWorkflowList();
  }

  ngOnInit() {
    this.viewMode = 'tab1';
    this.quillEditorGuidanceText = this.fb.group({
      guidancetext: new FormControl(null)
    });
    
  }

  nextTab() {
    //this.loadWorkflowById();
    console.log(this.viewMode, 'viewMode..');
    if (this.viewMode == 'tab1') {
   //   this.loadWorkflowById();
      if(this.workflowName && this.workflowselection){
        if(this.workflowStages.length !== 0){
          this.viewMode = 'tab2';
        }
        
      }
           
    } else if (this.viewMode == 'tab2') {
      
      if(this.stage_title){
        this.viewMode = 'tab3';
        const requestObj = {
          workflow_name:this.workflowName,
          workflow_stages: this.workflowStages
        }
        console.log('requestObj',requestObj);
        this.workflowService.createWorkflow(requestObj).subscribe((data)=>{
          if(data){
            alert('workflow created!');
          }
        },(error)=>{
          alert(JSON.stringify(error));
        })
      }else {
        return false;
      }
     
    }
  }

  previousTab(){
    if (this.viewMode == 'tab3') {
      this.viewMode = 'tab2';
    } else if(this.viewMode == 'tab2'){
      this.viewMode = 'tab1';
    }
  }

  loadWorkflowList() {
    this.workflowService.getWorkflow().subscribe((data) => {
      const key = 'response';
      this.workflowList = data.response;
    });

  }

  loadWorkflowById(id) {
    this.workflowService.getWorkflowById(id).subscribe((data) => {
      if (data) {
        let respData = data.response[0].workflow_stages;
        this.workflowStages = this.rearrangeArrayResponse(respData);
      }
    }, (error) => {
      alert(JSON.stringify(error));
    })
  }

  onWorkflowChange($event){
    console.log($event,'$event.');
    this.loadWorkflowById($event.target.value);
  }

  
  selectCurrentStage(item) {
    console.log(item, 'item..');
    this.currentStage = item.order;
  }

  clickOnWorkflowStages($event) {
    this.selectedTab = $event;
    this.isTabSelected = true;
    console.log($event, '$event..');
    this.stage_title = $event.stage_title; // + ' ' + $event.order;
    this.editorGuidanceText = $event.guidance_text;
    
   
  }

  update(title) {
    let index = this.workflowStages.findIndex((t) => t.order === this.selectedTab.order);
    this.workflowStages[index].stage_title = title;
  }

  rearrangeArrayResponse(dataArray) {
    dataArray.sort((a, b) => {
      return a.order - b.order;
    });
    return dataArray;
  }

  onClickWorflowTab(viewTab){
    if(viewTab == 'tab1'){
      this.viewMode = viewTab;
    }
    if(viewTab == 'tab2'){
      if(this.workflowStages.length !== 0){
         this.viewMode = viewTab;
      } else {
        return false;
      }      
    }
    if(viewTab == 'tab3'){
      if(this.workflowStages.length !== 0){
      this.viewMode = viewTab;
      } else {
        return false;
      }
    }
  }

}
