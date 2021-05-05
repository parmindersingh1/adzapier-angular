import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PropertydashboardComponent } from './propertydashboard.component';

describe('PropertydashboardComponent', () => {
  let component: PropertydashboardComponent;
  let fixture: ComponentFixture<PropertydashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertydashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertydashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
