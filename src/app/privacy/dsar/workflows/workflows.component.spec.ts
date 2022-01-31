import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WorkflowsComponent } from './workflows.component';

describe('WorkflowsComponent', () => {
  let component: WorkflowsComponent;
  let fixture: ComponentFixture<WorkflowsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('current managed organization is should not be undefined', () => {
    expect(component.currentManagedOrgID).toBeTruthy();
  });

  it('should expect default workflow',()=>{
    const mockdata = [{
      "active": true,
      "guidance_text": "Only requests that have some type of verification enabled on the web form will be reached at this stage. Webform requests submitted without any verification enabled will go to the new stage directly.",
      "id": "b5522735-3751-486e-a951-2085b6c12612",
      "order": 1,
      "stage_title": "UNVERIFIED",
      "ws_stage_status": "default"
  }]
    component.workflowStages = mockdata;
    fixture.detectChanges();
    expect(component.workflowStages).toBeTruthy();
  })
  
});
