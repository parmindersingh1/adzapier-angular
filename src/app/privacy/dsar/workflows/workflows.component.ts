import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.scss']
})
export class WorkflowsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  createWorkflow(){
    this.router.navigate(['/privacy/dsar/createworkflow']);
  }

}
