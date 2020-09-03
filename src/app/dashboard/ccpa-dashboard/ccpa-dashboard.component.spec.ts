import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcpaDashboardComponent } from './ccpa-dashboard.component';

describe('CcpaDashboardComponent', () => {
  let component: CcpaDashboardComponent;
  let fixture: ComponentFixture<CcpaDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcpaDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcpaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
