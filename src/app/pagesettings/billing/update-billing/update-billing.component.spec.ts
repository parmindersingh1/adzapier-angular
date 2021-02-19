import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdateBillingComponent } from './update-billing.component';

describe('UpdateBillingComponent', () => {
  let component: UpdateBillingComponent;
  let fixture: ComponentFixture<UpdateBillingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
