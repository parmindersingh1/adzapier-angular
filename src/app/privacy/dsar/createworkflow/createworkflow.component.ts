import { Component, OnInit } from '@angular/core';
import { WorkflowService } from 'src/app/_services/workflow.service';

@Component({
  selector: 'app-createworkflow',
  templateUrl: './createworkflow.component.html',
  styleUrls: ['./createworkflow.component.scss']
})
export class CreateworkflowComponent implements OnInit {
  workflowList: any;
  viewMode: any;
  workflowName: any;
  workflowselect: any;
  constructor(private workflowService: WorkflowService) { }

  ngOnInit() {
    this.viewMode = 'tab1';
    this.loadWorkflowList();
  }

  nextTab(){
    console.log(this.viewMode,'viewMode..');
    if(this.viewMode == 'tab1'){
      this.viewMode = 'tab2';
    } else if(this.viewMode == 'tab2'){
      this.viewMode = 'tab3'
    } 
  }

  loadWorkflowList(){
    this.workflowService.getWorkflow().subscribe((data)=>{
      const key = 'response';
      this.workflowList = data.response; 
    });
    
  }


}
