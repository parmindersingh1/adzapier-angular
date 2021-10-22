import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubspotQueryBuilderComponent } from './hubspot-query-builder.component';

describe('HubspotQueryBuilderComponent', () => {
  let component: HubspotQueryBuilderComponent;
  let fixture: ComponentFixture<HubspotQueryBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HubspotQueryBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HubspotQueryBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
