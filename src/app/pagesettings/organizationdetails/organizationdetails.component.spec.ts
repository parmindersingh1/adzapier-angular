import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrganizationdetailsComponent } from './organizationdetails.component';

describe('OrganizationdetailsComponent', () => {
  let component: OrganizationdetailsComponent;
  let fixture: ComponentFixture<OrganizationdetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
