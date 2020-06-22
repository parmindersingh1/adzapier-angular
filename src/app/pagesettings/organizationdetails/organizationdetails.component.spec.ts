import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationdetailsComponent } from './organizationdetails.component';

describe('OrganizationdetailsComponent', () => {
  let component: OrganizationdetailsComponent;
  let fixture: ComponentFixture<OrganizationdetailsComponent>;

  beforeEach(async(() => {
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
