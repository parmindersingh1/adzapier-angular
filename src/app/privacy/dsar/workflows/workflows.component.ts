import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { WorkflowService } from 'src/app/_services/workflow.service';

@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.scss']
})
export class WorkflowsComponent implements OnInit {
  workflowList: any = [];
  constructor(private router: Router, private workflowService: WorkflowService) { }

  ngOnInit() {
    this.loadWorkflowList();
  }

  createWorkflow(){
    this.router.navigate(['/privacy/dsar/createworkflow']);
  }

  loadWorkflowList(){
    this.workflowService.getWorkflow().subscribe((data)=> this.workflowList.push(data));
  }

}
