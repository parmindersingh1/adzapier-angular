import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrganizationteamComponent } from './organizationteam.component';

describe('OrganizationteamComponent', () => {
  let component: OrganizationteamComponent;
  let fixture: ComponentFixture<OrganizationteamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationteamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
