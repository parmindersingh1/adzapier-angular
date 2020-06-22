import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationteamComponent } from './organizationteam.component';

describe('OrganizationteamComponent', () => {
  let component: OrganizationteamComponent;
  let fixture: ComponentFixture<OrganizationteamComponent>;

  beforeEach(async(() => {
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
