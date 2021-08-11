import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { DsarRequestdetailsComponent } from './dsar-requestdetails.component';

describe('DsarRequestdetailsComponent', () => {
  let component: DsarRequestdetailsComponent;
  let fixture: ComponentFixture<DsarRequestdetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DsarRequestdetailsComponent ],
      imports:[ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsarRequestdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have workflow first stage selected',()=>{
    expect(component.selectedStages.length).toBeGreaterThanOrEqual(1);
  })

  it('should container organization and property id',()=>{
    expect(component.currentManagedOrgID).toBeDefined();
    expect(component.currrentManagedPropID).toBeDefined();
  })

  it('should have request id',()=>{
    expect(component.requestID).toBeDefined()
  })

});
