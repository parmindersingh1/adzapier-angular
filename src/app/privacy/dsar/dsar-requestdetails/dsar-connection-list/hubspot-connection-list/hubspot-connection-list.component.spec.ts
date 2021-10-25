import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubspotConnectionListComponent } from './hubspot-connection-list.component';

describe('HubspotConnectionListComponent', () => {
  let component: HubspotConnectionListComponent;
  let fixture: ComponentFixture<HubspotConnectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HubspotConnectionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HubspotConnectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
