import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CCPAComponent } from './ccpa.component';

describe('CcpaComponent', () => {
  let component: CCPAComponent;
  let fixture: ComponentFixture<CCPAComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CCPAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CCPAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
