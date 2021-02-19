import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrgpageComponent } from './orgpage.component';

describe('OrgpageComponent', () => {
  let component: OrgpageComponent;
  let fixture: ComponentFixture<OrgpageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
