import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { WorkflowService } from 'src/app/_services/workflow.service';
import { OrganizationService } from 'src/app/_services/organization.service';

@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.scss']
})
export class WorkflowsComponent implements OnInit {
  selectedProperty: any;
  currentOrganization: any;
  orgId: any;
  propId: any;
  workflowList: any = [];
  createdById: any;
  updatedById: any;
  createdUpdatedBy: any;
  updatedBy: any;
  teamMemberList: any;
  constructor(private router: Router, private workflowService: WorkflowService,
    private organizationService: OrganizationService
    ) { }

  ngOnInit() {
    this.getCurrentOrgProperty();
    this.loadWorkflowList();
  }

  createWorkflow(){
    this.router.navigate(['/privacy/dsar/createworkflow']);
  }

  loadWorkflowList(){
    this.workflowService.getWorkflow().subscribe((data)=>{
      const key = 'response';
      this.workflowList = data.response;
      this.createdById = data.response[0].created_by;
      this.updatedById = data.response[0].updated_by;
    });
    
  }

  createdUpdatedByUser(userId){
    this.organizationService.getOrgTeamMembers(this.orgId).subscribe((data) => {
      this.teamMemberList = data['response'];
      const x = this.teamMemberList.filter((t)=>t.approver_id === userId);
      this.createdUpdatedBy =  x[0].user_name;
    });
  }

  getCurrentOrgProperty() {
    this.organizationService.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.selectedProperty = response.property_name;
        this.currentOrganization = response.organization_name;
        this.orgId = response.organization_id;
        this.propId = response.property_id;
      } else {
        const orgDetails = this.organizationService.getCurrentOrgWithProperty();
        this.currentOrganization = orgDetails.organization_name;
        this.selectedProperty = orgDetails.property_name;
        this.orgId = orgDetails.organization_id;
        this.propId = orgDetails.property_id;
      }
    });
  }

}
