import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DsarRequestsComponent } from './dsar-requests.component';

describe('DsarRequestsComponent', () => {
  let component: DsarRequestsComponent;
  let fixture: ComponentFixture<DsarRequestsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DsarRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsarRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
