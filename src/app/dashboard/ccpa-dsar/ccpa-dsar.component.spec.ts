import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CcpaDsarComponent } from './ccpa-dsar.component';

describe('CcpaDsarComponent', () => {
  let component: CcpaDsarComponent;
  let fixture: ComponentFixture<CcpaDsarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CcpaDsarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcpaDsarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
